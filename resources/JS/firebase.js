import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD28vvL4xBqoS0tqAiPlPvehoyMhBQ0awk",
  authDomain: "yjwproject-15387.firebaseapp.com",
  projectId: "yjwproject-15387",
  storageBucket: "yjwproject-15387.appspot.com",
  messagingSenderId: "1032109809173",
  appId: "1:1032109809173:web:f203b7ca13abec9519781c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getMembers() {
  const collect = await collection(db, "member");
  const snapshot = await getDocs(collect);
  //   snapshot.foreEach((doc) => {
  //     console.log(doc.data());
  //   });
  return snapshot;
}

export { db, getMembers };
