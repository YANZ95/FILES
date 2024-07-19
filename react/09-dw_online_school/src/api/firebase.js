import { initializeApp } from "firebase/app";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

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

async function getData(collectionName, option) {
  const { field, condition, value } = option;
  //
  const collect = collection(db, collectionName);
  const q = query(collect, where(field, condition, value));
  // 구조분해 사용
  const snapshot = await getDocs(q);
  // 가져오려는 게 한 개면 getDoc, 근데 이건 아이디 필요
  const resultData = { ...snapshot.docs[0].data(), docId: snapshot.docs[0].id };
  return resultData;
}

async function getMember(values) {
  const { email, password } = values;

  const collect = collection(db, "member");
  const q = query(collect, where("email", "==", email));
  // 비교조건
  const snapshot = await getDocs(q);
  //  문서 아이디를 모르기 때문에 getDocs 사용함
  // snapshot은 있든 없든 무조건 나옴
  const docs = snapshot.docs;

  let message;
  let memberObj = {};

  // 아이디 일치 ㄴ = 덕스의 랭스가 0이다.
  if (docs.legth == 0) {
    // 로 ㅇ 정보 리턴, 로긔인 객체 정보 성공 알림
    // 로그인 알림 => 아이디 ㄴ, 비밀 ㄴ 알려주고 싶음
    message = "이메일이 올바르지 않습니다. ";
  } else {
    //패스워드가 맞을 때와 틀릴 때
    const memberData = { ...docs[0].data(), docId: docs[0].id };
    // {...docs[0]. data(), docId: docs[0].id}; 구조분해
    if (password === memberData.password) {
      message = "로그인에 성공했습니다.";
      memberObj = {
        email: memberData.email,
        docId: memberData.docId,
      };
    } else {
      message = "비밀번호가 일치하지 않습니다.";
    }
  }

  return { memberObj, message, getMember };
}

async function updateDatas(collectionName, docId, updateObj, option) {
  // 문서의 reference 객체가 필요
  const docRef = doc(db, collectionName, docId);
  // 로그인한 사용자의 문서 아이디

  try {
    // 배열을 저장하는 필드
    if (!option) {
      await updateDoc(docRef, updateObj);
      // 업데이트는 이게 끝임
    } else {
      // 옵션이 들어왔을 때
      if (option.type == "ADD") {
        // 파이어베이스에서 그대로 가져옴
        await updateDoc(docRef, {
          [option.fieldName]: arrayUnion(updateObj),
          // option.fieldName 키값인데 객체처리가 안되서 오류난 거. 대괄호해야됨
        });
        // 옵션에는 필드명하고 추가를 해야 할지 삭제를 할 지 파라미터를 받은 다음 어레이유니온할 지 어레이리무브할 지 정한다.
      } else if (option.type == "DELETE") {
        await updateDoc(docRef, {
          [option.fieldName]: arrayRemove(updateObj),
        });
        // 수정이 성공했는 지 실패했는 지 확인해야됨
        // 이거를 트라이캐치 캐치 안에 집어넣었다.
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
// 로그인 파일에서 만들고 반환받는 방법이 있고 파이어베이스에서 하는 방법이 있다.
// 사무 가면 var 되 있는데 let으로 바꿔주는 게 좋음
// 구조분해하면 사무에서 물어볼거임. 똑같은 거라고 대답하면 됨
export { getDatas, getData, getMember, updateDatas };
