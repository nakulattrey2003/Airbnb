import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UpdatePage.scss";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../redux/state.js";

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
        `http://localhost:5000/users/${userId}/update`,
        {
          method: "PATCH",
          body: update_form,
        }
      );

      const updatedUser = await response.json();
      console.log(updatedUser);

      if (response.ok) {
        dispatch(updateUserProfile(updatedUser.user));
        toast.success("User Updated Successfully");
        console.log("User Updated Successfully");
        navigate("/");
      } else {
        console.log("Some Error in Updating");
        toast.error("Some Error in Updating");
      }
    } catch (err) {
      console.log("Updating user failed", err.message);
    }
  };

  return (
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
      <ToastContainer />
    </div>
  );
};

export default UpdatePage;
