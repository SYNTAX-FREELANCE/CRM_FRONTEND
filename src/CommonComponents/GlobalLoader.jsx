import React from "react";
// import "./GlobalLoader.css";

import '../Style/GlobalLoader.css';

const GlobalLoader = ({ text = "Please wait..." }) => {
  return (
    <div className="global-loader-overlay">
      <div className="global-loader-container">
        <div className="loader"></div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;