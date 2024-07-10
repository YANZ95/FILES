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
  apiKey: "AIzaSyCRkGq_fctCvfrrUl_PGw4M194sgnMpsKY",
  authDomain: "friday-project-2cf85.firebaseapp.com",
  projectId: "friday-project-2cf85",
  storageBucket: "friday-project-2cf85.appspot.com",
  messagingSenderId: "1032064283059",
  appId: "1:1032064283059:web:2d94e4f5cd9b4e1d295bc6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getAllDatas(collectionName, order) {
  const collect = collection(db, collectionName);
  const q = query(collect, orderBy(order, "desc")); // 강사님이 안 해주더라도 혼자 알아서 주석 달아라
  const querySnapshot = await getDocs(q);
  const resultData = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  })); //객체취급하려면 doc.data에 소괄호 달아줘야됨
  return resultData;
}

export { getAllDatas };
