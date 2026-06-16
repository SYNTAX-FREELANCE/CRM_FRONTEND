import React from "react";

const ButtonWrapper = ({ children }) => {
    return (
        <div style={{
            borderTop: "1px solid #e5e7eb",
            margin: "20px 0",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            paddingTop: "8px",
        }}>
            {children}
        </div>
    );
};

export default ButtonWrapper;