import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoAuth from "../components/GoAuth";
//import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
//import { auth } from "../firebase/firebaseConfig.js";

const RegisterPage = () => {
  // hooks
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // functions
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData, // used for the previous data to be also there and new data should be added with the previous data
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const register_form = new FormData();

      for (var key in formData) {
        register_form.append(key, formData[key]);
      }

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        body: register_form,
      });

      console.log(response);

      if (response.ok) {
        toast.success("User Registered Successfully");
        console.log("User Registered Successfully");
        navigate("/login");
      } else {
        console.log("User Already Exists");
        toast.error("User Already Exists");
      }
    } catch (err) {
      console.log("Registration failed", err.message);
    }
  };

  return (
    <div className="register">
      <img src="/assets/airbnbLogo.png" alt="" />
      <div className="register-header">Register Page</div>
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <input
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required
              style={{
                width: "85%", // Adjust as needed
                paddingRight: "10px", // Adjust as needed
                marginRight: "15px", // Add margin for gap
              }}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="toggle-password-btn"
              style={{
                color: "white",
                width: "15%", // Adjust as needed
                height: "45px",
                background: "#FF385C",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <input
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required
              style={{
                width: "85%", // Adjust as needed
                paddingRight: "10px", // Adjust as needed
                marginRight: "15px", // Add margin for gap
              }}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="toggle-password-btn"
              style={{
                color: "white",
                width: "15%", // Adjust as needed
                height: "45px",
                background: "#FF385C",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assets/uploadBlack.png" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch}>
            REGISTER
          </button>
        </form>
        <GoAuth />
        <a href="/login">Already have an account? Log In Here</a>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
