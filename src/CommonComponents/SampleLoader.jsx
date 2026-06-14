import React from "react";
// import "./SampleLoader.css";
import '../Style/SampleLoader.css'

const SampleLoader = ({ text = "Loading..." }) => {
  return (
    <div className="sample-loader-wrapper">
      <div className="loader">{text}</div>
    </div>
  );
};

export default SampleLoader;