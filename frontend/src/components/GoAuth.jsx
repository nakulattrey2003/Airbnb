import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../redux/state";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

export default function GoAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleAuthHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // console.log(provider);
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      const res = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profileImagePath: result.user.photoURL,
        }),
      });

      const data = await res.json();
      // console.log(data);

      if (res.ok) {
        toast.success("User Logged in Successfully");
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/");
      } else {
        toast.error("User or Password is Incorrect");
        console.log("User or Password is Incorrect");
      }
    } catch (error) {
      console.log("Error in Google Authentication", error);
    }
  };

  return (
    <button
      onClick={googleAuthHandler}
      style={{
        backgroundColor: "#fff",
        color: "#333",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0px 0px 0.4rem rgba(0, 0, 0, 0.3)", // Shadow effect
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FcGoogle style={{ marginRight: "20px", fontSize: "25px" }} />
      Sign in with Google
    </button>
  );
}
