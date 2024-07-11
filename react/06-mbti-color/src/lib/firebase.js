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

async function getAllDatas(collectionName, order, lq) {
  const collect = collection(db, collectionName);
  let q = query(collect, orderBy(order, "desc"), limit(10)); // 강사님이 안 해주더라도 혼자 알아서 주석 달아라
  if (lq) {
    // 만약 lq가 존재한다면
    q = query(collect, orderBy(order, "desc"), startAfter(lq), limit(10));
  }
  // 10개만 나오도록 제한
  // 더 보기 ->핸들모어 함수 입력 (무피페디아)
  // 핸들스크롤 바닥에 닿았을 때 추가되도록 추가할 거임
  const querySnapshot = await getDocs(q);
  const lastQuery = querySnapshot.docs[querySnapshot.docs.length - 1];
  // 라스트쿼리 밖으로 빼야 됨 리저트 쿼리도 해서 두개 빼야됨
  const resultData = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  })); //객체취급하려면 doc.data에 소괄호 달아줘야됨
  return { resultData, lastQuery };
  // 라스트쿼리 밖으로 빼야 됨 리저트 쿼리도 해서 여기에
}

async function addDatas(collectionName, dataObj) {
  const collect = collection(db, collectionName);
  // id 값 생성
  const lastId = (await getLastNum(collectionName, "id")) + 1;
  //  괄호 쳐주지 않으면 계산 안 됨
  // 날짜 생성
  const time = new Date().getTime();
  // 추가할 data 객체에 필요한 필드 정보 추가
  dataObj.id = lastId;
  dataObj.createdAt = time;
  dataObj.updatedAt = time;
  // 문서에 data 객체 저장
  const result = await addDoc(collect, dataObj);
  return result;
  // 요렇게 하면 에드데이터 완성됨
}

async function getLastNum(collectionName, field) {
  const q = query(
    collection(db, collectionName),
    orderBy(field, "desc"),
    limit(1)
  );
  const lastDoc = await getDocs(q);
  const lastNum = lastDoc.docs[0].data()[field];
  return lastNum;
}

export { getAllDatas, addDatas };
