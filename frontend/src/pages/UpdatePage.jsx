import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UpdatePage.scss";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../redux/state.js";
import Navbar from "../components/Navbar.jsx"

const UpdatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    profileImage: null,
  });

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const userId = useSelector((state) => state?.user?._id);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    if (!userId) {
      toast.error("Please Login in First to Book properties");
      navigate("/login");
      return;
    }

    e.preventDefault();

    try {
      const update_form = new FormData();

      for (var key in formData) {
        update_form.append(key, formData[key]);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}/update`,
        {
          method: "PATCH",
          body: update_form,
        }
      );

      const updatedUser = await response.json();

      if (response.ok) {
        dispatch(updateUserProfile(updatedUser.user));
        toast.success("User Updated Successfully");
        // console.log("User Updated Successfully");
        navigate("/");
      } else {
        // console.log("Some Error in Updating");
        toast.error("Some Error in Updating");
      }
    } catch (err) {
      toast.error("Updating user failed");
      // console.log("Updating user failed", err.message);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="update-page">
      <h1 className="update-header">Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <div className="password-container">
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="toggle-password-btn"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          id="photo"
          type="file"
          name="profileImage"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleChange}
        />
        <label htmlFor="photo" className="image-uploader">
          <img src="/assets/uploadBlack.png" alt="add profile photo" />
          <p>Upload Your Photo</p>
        </label>
        {formData.profileImage && (
          <img
            src={URL.createObjectURL(formData.profileImage)}
            alt="profile photo"
            className="photo-preview"
          />
        )}
        <button type="submit">Update</button>
      </form>
    </div>
    </div>
  );
};

export default UpdatePage;
