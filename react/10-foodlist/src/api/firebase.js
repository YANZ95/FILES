import { initializeApp } from 'firebase/app';
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
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6SpkPT2nTZ5E_gAN-yWwSTO0T-2mFcKM",
  authDomain: "foodlist-933e2.firebaseapp.com",
  projectId: "foodlist-933e2",
  storageBucket: "foodlist-933e2.appspot.com",
  messagingSenderId: "110449462213",
  appId: "1:110449462213:web:7a59e12d3155ae193d19ac",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getCollection(collectionName) {
  return collection(db, collectionName);
}

function createPath(path) {
  const uuid = crypto.randomUUID();
  return path + uuid;
}

async function addDatas(collectionName, addObj) {
  // 최대한 쪼개서 만드는 게 큰 프로젝트 만들 때 도움이 된다.
  // 파일 저장 ==> 스토리지의 이미지 url을 addObj의 imgUrl 값으로 변경
  const path = createPath("food/");
  const url = await uploadImage(path, addObj.imgUrl);
  addObj.imgUrl = url;

  // id 생성
  const lastId = (await getLastNum(collectionName, "id")) + 1;
  addObj.id = lastId;

  // 시간 정보 생성
  const time = new Date().getTime();
  addObj.createdAt = time;
  addObj.updatedAt = time;
  // 저장할 수 있는 객체가 만들어짐

  // 컬렉션에 저장
  await addDoc(getCollection(collectionName), addObj);
  // 컬렉션하고 저장할 객체
}

async function uploadImage(path, file) {
  const storage = getStorage();
  const imageRef = ref(storage, path);

  // File 객체를 스토리지에 저장
  await uploadBytes(imageRef, file);

  // 저장한 File의 url을 받는다.
  const url = await getDownloadURL(imageRef);
  return url;
}

async function getLastNum(collectionName, field) {
  const q = query(
    getCollection(collectionName), // collection
    orderBy(field, 'desc'), // 정렬할 필드로 내림차순
    limit(1) // 1개만 가져온다
  );
  const lastDoc = await getDocs(q);
  const lastId = lastDoc.docs[0].data()[field];
  return lastId;
}

async function getDatasOrderByLimit(collectionName, options) {
  const { fieldName, limits } = options;
   // 일단 두개 받아서 쓸거임
  let q;
  if (!options.lq) {
    q = query(
       // 다 가져오되 정렬을 할 거고, 몇개만 가져올거고, 조건을 달아서 컬렉션함수만 넣을 거면
    //  컬렉션 함수만 넣을거지만 다른 함수도 넣을 거라서 쿼리함수 넣어줌
      getCollection(collectionName),
       // 위에서 쓴 거 받아서 써줌
      orderBy(fieldName, 'desc'),
      limit(limits)
    );
  } else {
    q = query(
      getCollection(collectionName),
      orderBy(fieldName, 'desc'),
      startAfter(options.lq),
      limit(limits)
    );
  }


  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  const lastQuery = docs[docs.length - 1];
  console.log(lastQuery);
  const resultData = docs.map(function (doc) {
    return { ...doc.data(), docId: doc.id };
  });
    // 일반함수로 쓰면 (function(doc){return {...doc.data(), docId: doc.id}});
  return { resultData, lastQuery };
}

export { addDatas, getDatasOrderByLimit };

// async function getDatas(collectionName) {
//   const collect = await collection(db, collectionName);
//   const lifefood = await getDocs(collect);
//   const resultData = await getDocs.map({doc} => ({
//     docId: doc.id,
//     ...doc.data(),
//   }));

//   return resultData;
// }
// async function getDatasByOrderLimit(collectionName, options) {
//   const collect = await collection(db, collectionName);
//   let q;
//   if (options.lq) {
//     q = query(
//       collect,
//       orderBy(options.order, "desc"),
//       startAfter(options.lq),
//       limit(options.limit)
//     );
//   } else {
//     q = query(collect, orderBy(options.order, "desc"), limit(options.limit));
//   }
//   const lifefood = await getDocs(q);
//   const lastQuery = lifefood.docs[lifefood.docs.length - 1];
//   console.log(lastQuery);
//   const resultData = lifefood.docs.map((doc) => ({
//     docId: doc.id,
//     ...doc.data(),
//   }));

//   return { resultData, lastQuery };
// }

// async function addDatas(collectionName, dataObj) {
//   try {
//     const uuid = crypto.randomUUID();
//     const path = `movie/${uuid}`;
//     const url = await uploadImage(path, dataObj.imgUrl);

//     dataObj.imgUrl = url;
//     // createdAt, updatedAt ==> 현재 날짜 밀리세컨즈로 바꿔서
//     const time = new Date().getTime();
//     dataObj.createdAt = time;
//     dataObj.updatedAt = time;

//     // id 필드의 값 ==> 가장 큰 id + 1
//     const lastId = await getLastNum(collectionName, "id");
//     dataObj.id = lastId + 1;

//     // 문서 ID 자동
//     const collect = await collection(db, collectionName);
//     const result = await addDoc(collect, dataObj);
//     const docSnap = await getDoc(result); // result == > documentReference

//     const resultData = { ...docSnap.data(), docId: docSnap.id };

//     return resultData;
//   } catch (error) {
//     return false;
//   }
// }

// async function getLastNum(collectionName, field) {
//   const q = query(
//     collection(db, collectionName),
//     orderBy(field, "desc"),
//     limit(1)
//   );
//   const lastDoc = await getDocs(q);
//   const lastNum = lastDoc.docs[0].data()[field];
//   return lastNum;
// }

// async function uploadImage(path, imgFile) {
//   // 스토리지 객체 가져오기
//   const storage = getStorage();
//   // 저장할 이미지 객체 생성
//   const imageRef = ref(storage, path);
//   // File 객체를 스토리지에 저장
//   await uploadBytes(imageRef, imgFile);
//   // 저장한 File의 url 가져오기
//   const url = await getDownloadURL(imageRef);
//   return url;
// }

// async function deleteDatas(collectionName, docId, imgUrl) {
//   // 1. 스토리지 객체 가져온다.
//   const storage = getStorage();

//   try {
//     // 2. 스토리지에서 이미지 삭제
//     const deleteRef = ref(storage, imgUrl);
//     await deleteObject(deleteRef);
//     // 3. 컬렉션에서 문서 삭제
//     const docRef = await doc(db, collectionName, docId);
//     await deleteDoc(docRef);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// async function updateDatas(collectionName, dataObj, docId) {
//   // console.log(imgUrl);
//   console.log(dataObj.imgUrl);
//   const docRef = await doc(db, collectionName, docId);
//   // 수정할 데이터 양식 생성 => title, content, rating, updatedAt, imgUrl
//   const time = new Date().getTime();
//   dataObj.updatedAt = time;
//   // 사진파일이 수정되면 => 기존사진 삭제 => 새로운사진 추가 => url 받아와서 imgUrl 값 셋팅
//   if (dataObj.imgUrl !== null) {
//     // 기존사진 url 가져오기
//     const docSnap = await getDoc(docRef);
//     const prevImgUrl = docSnap.data().imgUrl;
//     // 스토리지에서 기존사진 삭제
//     const storage = getStorage();
//     const deleteRef = ref(storage, prevImgUrl);
//     await deleteObject(deleteRef);
//     // 새로운사진 추가
//     const uuid = crypto.randomUUID();
//     const path = `movie/${uuid}`;
//     const url = await uploadImage(path, dataObj.imgUrl);
//     dataObj.imgUrl = url;
//   } else {
//     // imgUrl 프로퍼티 삭제
//     delete dataObj["imgUrl"];
//   }
//   // 사진파일이 수정되지 않으면 => 변경데이터만 업데이트
//   await updateDoc(docRef, dataObj);
//   const updatedData = await getDoc(docRef);
//   const resultData = { docId: updatedData.id, ...updatedData.data() };
//   return resultData;
// }

// export {
//   db,
//   getDatas,
//   addDatas,
//   deleteDatas,
//   updateDatas,
//   getDatasByOrder,
//   getDatasByOrderLimit,
// };
