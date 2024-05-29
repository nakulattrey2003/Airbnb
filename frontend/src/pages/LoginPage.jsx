import React, { useState } from "react";
import "../styles/Login.scss";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
//import { auth } from "../firebase/firebaseConfig.js";
import GoAuth from "../components/GoAuth.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      /* Get data after fetching */
      const loggedIn = await response.json();

      console.log(loggedIn);

      if (response.ok) {
        toast.success("Login Successfull", toastOptions);
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/");
      } else {
        toast.error("User or Password is Incorrect");
        console.log("User or Password is Incorrect");
      }
    } catch (err) {
      console.log("Login failed", err.message);
    }
  };

  return (
    <div className="login">
      <div className="login_logo">
        <img src="/assets/airbnbLogo.png" alt="Logo" />
      </div>
      <div className="login-header">Login Page</div>
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">LOG IN</button>
        </form>

        <GoAuth />

        <a href="/register">Don't have an account? Sign In Here</a>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
