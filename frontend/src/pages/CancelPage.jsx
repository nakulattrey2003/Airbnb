import React from "react";
import { Link } from "react-router-dom";

const CancelPage = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#CF3A2D",
      color: "white",
      textAlign: "center",
    },
    cancelImage: {
      width: "150px",
      height: "150px",
      marginBottom: "20px",
    },
    homeButton: {
      padding: "10px 20px",
      fontSize: "16px",
      color: "#ED5951",
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
          src="https://cdn-icons-png.flaticon.com/128/16206/16206622.png" // Replace with your success image URL
          alt="Cancel"
          style={styles.cancelImage}
        />
        <h1>Booking Canceled</h1>
        <p>Retry or Wait for some time.</p>
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

export default CancelPage;
