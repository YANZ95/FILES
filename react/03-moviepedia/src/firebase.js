import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6gyhP6B8b6iEhSSxukLLCPJqARu_fmr0",
  authDomain: "moviepedia-24d73.firebaseapp.com",
  projectId: "moviepedia-24d73",
  storageBucket: "moviepedia-24d73.appspot.com",
  messagingSenderId: "113514152236",
  appId: "1:113514152236:web:00a7158ad40a92326cac89",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getDatas(collectionName) {
  const collect = await collection(db, collectionName);
  const snapshot = await getDocs(collect);
  const resultData = snapshot.docs.map((doc) => ({
    docId: doc.id,
    ...doc.data(),
  }));

  return resultData;
}

async function getDatasByOrder(collectionName, options) {
  const collect = await collection(db, collectionName);
  // const q = query(컬렉션정보, 조건1, 조건2, 조건3...);
  const q = query(collect, orderBy(options.order, "desc"));
  const snapshot = await getDocs(q);
  const resultData = snapshot.docs.map((doc) => ({
    docId: doc.id,
    ...doc.data(),
  }));

  return resultData;
}

async function getDatasByOrderLimit(collectionName, options) {
  const collect = await collection(db, collectionName);
  let q;
  if (options.lq) {
    q = query(
      collect,
      orderBy(options.order, "desc"),
      startAfter(options.lq),
      limit(options.limit)
    );
  } else {
    q = query(collect, orderBy(options.order, "desc"), limit(options.limit));
  }
  const snapshot = await getDocs(q);
  const lastQuery = snapshot.docs[snapshot.docs.length - 1];
  console.log(lastQuery);
  const resultData = snapshot.docs.map((doc) => ({
    docId: doc.id,
    ...doc.data(),
  }));

  return { resultData, lastQuery };
}

async function addDatas(collectionName, dataObj) {
  try {
    // 문서 ID 수동
    // const saveDoc = await doc(db, collectionName, '3');
    // console.log(`doc() 결과: ${saveDoc}`);
    // const saveResult = await setDoc(saveDoc, dataObj);
    // console.log(`setDoc() 결과: ${saveResult}`);

    // 문서 ID 자동
    const collect = await collection(db, collectionName);
    await addDoc(collect, dataObj); // 결과 == undefined
    return true;
  } catch (error) {
    return false;
  }
}

async function deleteDatas(collectionName, docId) {
  const docRef = await doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

async function updateDatas(collectionName, docId, updateInfoObj) {
  const docRef = await doc(db, collectionName, docId);
  // const docData = await getDoc(docRef);
  await updateDoc(docRef, updateInfoObj);
}

export {
  db,
  getDatas,
  addDatas,
  deleteDatas,
  updateDatas,
  getDatasByOrder,
  getDatasByOrderLimit,
};
