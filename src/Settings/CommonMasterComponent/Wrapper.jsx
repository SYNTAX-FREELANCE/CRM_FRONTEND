import React from "react";

const Wrapper = ({ children }) => {
    return (
        <div style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "13px",
            backgroundColor: "#fbfcff",
            minHeight: "50vh",
            display: "flex",
            justifyContent: "center",
            // alignItems: 'center',
            width: "90%",
            padding: "20px",
        }}>
            {children}
        </div>
    );
};

export default Wrapper;