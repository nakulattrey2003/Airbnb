import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#28a745",
      color: "white",
      textAlign: "center",
    },
    successImage: {
      width: "150px",
      height: "150px",
      marginBottom: "20px",
    },
    homeButton: {
      padding: "10px 20px",
      fontSize: "16px",
      color: "#28a745",
      backgroundColor: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      textDecoration: "none",
      marginTop: "20px",
    },
    homeButtonHover: {
      backgroundColor: "#e6e6e6",
    },
  };

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = styles.homeButtonHover.backgroundColor;
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = "white";
  };

  return (
    <>
      <div style={styles.container}>
        <img
          src="https://cdn-icons-png.flaticon.com/128/16322/16322725.png" // Replace with your success image URL
          alt="Success"
          style={styles.successImage}
        />
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase.</p>
        <Link
          to="/"
          style={styles.homeButton}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Go to Home
        </Link>
      </div>
    </>
  );
};

export default SuccessPage;
