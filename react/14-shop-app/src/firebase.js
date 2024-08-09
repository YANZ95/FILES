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

function getCollection(collectionName) {
  return collection(db, collectionName);
}

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

  const condition = [
    { field: "text", operator: "==", value: "test" },
    { field: "uid", operator: "==", value: "xjdiwjKDJ2jdkxJND2J" },
  ];

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
