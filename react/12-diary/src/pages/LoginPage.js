import React, { useContext } from "react";
import "./LoginPage.css";
import * as FcIcons from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { DiaryStateContext } from "../App";
import { Navigate, useNavigate } from "react-router-dom";

function LoginPage() {
  const { auth } = useContext(DiaryStateContext);
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
    navigate("/", { replace: true });
    // : => type script 로 작성이 된거
  };

  return (
    <div className="login_box">
      <button onClick={signInWithGoogle}>
        <FcIcons.FcGoogle />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

export default LoginPage;
