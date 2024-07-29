import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJ78Mmhigfjam2amo2Htiuu7-eUCJA3SY",
  authDomain: "chatting-c4383.firebaseapp.com",
  projectId: "chatting-c4383",
  storageBucket: "chatting-c4383.appspot.com",
  messagingSenderId: "911061054422",
  appId: "1:911061054422:web:79d64a2d4a461499d02a77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function getCollection(collectionName) {
  return collection(db, collectionName);
}

function getUserAuth() {
  //  async 필요 없음. const auth = getAuth(app);에서 그대로 가져옴
  return auth;
}

export { getUserAuth };
