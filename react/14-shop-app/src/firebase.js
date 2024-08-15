import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  runTransaction,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  writeBatch,

} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9wqoQ7OpceSKG0ZAlwHc74z2CnbvKw6g",
  authDomain: "shop-app-b80d2.firebaseapp.com",
  projectId: "shop-app-b80d2",
  storageBucket: "shop-app-b80d2.appspot.com",
  messagingSenderId: "870165125150",
  appId: "1:870165125150:web:0edced6665307bfa7f760f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


function getCollection(...path) {
  let newPath = path;
  if (typeof path[0] !== 'string') {
    // [newPath] = path;
    newPath = path.flat();
  }
  return collection(db, ...newPath);
}


// function getCollection(collectionName) {
//   return collection(db, collectionName);
// }

export function getUserAuth() {
  //  async 필요 없음. const auth = getAuth(app);에서 그대로 가져옴
  return auth;
}

async function getLastNum(collectionName, field) {
  const q = query(
    collection(db, collectionName),
    orderBy(field, "desc"),
    limit(1)
  );
  const lastDoc = await getDocs(q);
  if (lastDoc.docs.length === 0) {
    return 0;
  }
  const lastNum = lastDoc.docs[0].data()[field];
  return lastNum;
}

function getQuery(collectionName, queryOption) {
  const { conditions = [], orderBys = [], limits } = queryOption;
  const collect = getCollection(collectionName);
  let q = query(collect);

  // const condition = [
  //   { field: "text", operator: "==", value: "test" },
  //   { field: "uid", operator: "==", value: "xjdiwjKDJ2jdkxJND2J" },
  // ];

  // where 조건
  conditions.forEach((condition) => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });

  // orderBy 조건
  orderBys.forEach((order) => {
    q = query(q, orderBy(order.field, order.direction || "asc"));
  });

  // limit 조건
  q = query(q, limit(limits));
  return q;
}

export async function getDatas(collectionName, queryOptions) {
  const q = getQuery(collectionName, queryOptions);
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  const resultData = docs.map((doc) => ({ ...doc.data(), docId: doc.id }));
  return resultData;
}

export async function getData(collectionName, queryOptions) {
  //  모조건 한 개만 있는 데이터를 조회할 때 쓴는 게 getData
  const q = getQuery(collectionName, queryOptions);
  const snapshot = await getDocs(q);
  const doc = snapshot.docs[0];
  const resultData = { ...doc.data(), docId: doc.id };
  return resultData;
}

export async function joinUser(uid, email) {
  await setDoc(doc(db, 'users', uid), { email: email });
}

export async function syncCart(uid, cartArr) {
  const cartRef = getCollection('users', uid, 'cart');
  const batch = writeBatch(db);

  for (const item of cartArr) {
    const result = await updateQuantity(uid, item);
    if (!result) {
      const itemRef = doc(cartRef, item.id.toString());
      batch.set(itemRef, item);
    }
  }

  await batch.commit();
  const resultData = await getDatas(['users', uid, 'cart'], {});
  return resultData;
}
export async function updateQuantity(uid, cartItem) {
  // 수량 업데이트 
  const cartRef = getCollection('users', uid, 'cart');
  const itemRef = doc(cartRef, cartItem.id.toString());
  // 문서가 존재하는지 확인
  const itemDoc = await getDoc(itemRef);
  if (itemDoc.exists()) {
    // const currentData = itemDoc.data();
    // const updatedQuantity = (currentData.quantity || 0) + 1;
    // await updateDoc(itemRef, { quantity: updatedQuantity });
    return true;
  } else {
    return false;
  }
}
export async function updateTotalAndQuantity(uid, docId, operator) {
  const cartRef = getCollection('users', uid, 'cart');
  const itemRef = doc(cartRef, docId.toString());

  const itemDoc = await getDoc(itemRef);
  const itemData = itemDoc.data();

  let updatedQuantity;
  if (operator == 'increment') {
    updatedQuantity = itemData.quantity + 1;
  } else {
    updatedQuantity = itemData.quantity - 1;
  }
  const updatedTotal = itemData.price * updatedQuantity;

  const updateObj = {
    quantity: updatedQuantity,
    total: updatedTotal,
  };
  await updateDoc(itemRef, updateObj);
}

export async function createOrder(uid, orderObj) {
  try {
    // 1. orders 컬렉션에 데이터 추가
    //    1.1 orderRef 객체 생성 ("users", uid, "orders")
    const ordersRef = getCollection('users', uid, 'orders');
    //    1.2 생성할 객체를 만들어준다.
    //        createObj = {cancelYn, createdAt, updatedAt, 기존 orderObj 프로퍼티들...}
    const createObj = {
      cancelYn: 'N',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      ...orderObj,
    };
    //    1.3 await addDoc
    const docRef = await addDoc(ordersRef, createObj);
    // 2. cart 문서 삭제
    //    2.1 batch 객체를 생성. writeBatch(db)
    const batch = writeBatch(db);
    //    2.2 orderObj.products.forEach 를 사용하여 삭제할 docRef 를 생성한다.
    const cartRef = getCollection('users', uid, 'cart');
    orderObj.products.forEach((product) => {
      //    2.3 batch.delete(docRef)
      const itemRef = doc(cartRef, product.id.toString());
      batch.delete(itemRef);
    });
    //    2.4 await batch.commit();
    await batch.commit();
    return docRef.id;
  } catch (error) {
    console.error(error);
  }
}
export async function deleteDatas(collectionName, docId) {
  // 데이터 삭제 
  try {
    const cartRef = getCollection(collectionName);
    const docRef = doc(cartRef, docId.toString());
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.log('Error Delete: ', error);
  }
}

export async function addCart(collectionName, cartObj) {
  const collectionRef = getCollection(collectionName);
  const cartRef = doc(collectionRef, cartObj.id.toString());
  await setDoc(cartRef, cartObj);
}
