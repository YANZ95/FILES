import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfN_heEROKpA_NaDaOXNSroulljdOmWnU",
  authDomain: "dw-os-37ad7.firebaseapp.com",
  projectId: "dw-os-37ad7",
  storageBucket: "dw-os-37ad7.appspot.com",
  messagingSenderId: "9380194530",
  appId: "1:9380194530:web:5de6d1a05b0571e00fd6bb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getDatas(collectionName) {
  const collect = collection(db, collectionName);
  const snapshot = await getDocs(collect);
  // 컬렉션 객체가 필요하다.
  const resultData = snapshot.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }));

  // 배열의 객체가 들어있는 형태가 필요하다.
  // doc.data() 하나의 객체니까 이렇게 되는건데 doc ->  (doc)
  // ... -> 스프레드 연산자
  return resultData;
}

export { getDatas };
