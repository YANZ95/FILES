import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import React, { useEffect } from "react";
import * as FcIcons from "react-icons/fc";
// 전체를 가져올건데 에프씨 아이콘에 담겠다는 의미
// 원래는 {FcIcons}에 담겨 사용함. 이건 구조분해해서 사용했음

function SignIn({ auth, login }) {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const loginResult = await signInWithPopup(auth, provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        <FcIcons.FcGoogle />
        <span>
          <b>구글로 로그인하기</b>
          {/* 원래는 크로스브라우징 기능도 넣어서  */}
        </span>
      </button>
      <span className="notice">
        🦊 아이폰(ios)은 safari, chrome <br />
        등으로 로그인 해주세요. 🙏
      </span>
    </>
  );
}

export default SignIn;
