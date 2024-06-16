import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0", // Light gray background color
      }}
    >
      <div
        style={{
          border: "8px solid rgba(0, 0, 0, 0.1)",
          borderTop: "8px solid #3498db", // Blue color for the top border
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          animation: "spin 1s linear infinite", // Animation definition
        }}
      ></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
