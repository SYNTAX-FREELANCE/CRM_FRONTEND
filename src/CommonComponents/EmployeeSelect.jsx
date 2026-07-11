import React from "react";
import { Box } from "@mui/joy";

const EmployeeSelect = ({ value, onChange, employees = [] }) => {
    return (
        <Box sx={{ width: "100%" }}>
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    height: "30px",
                    // borderRadius: "14px",
                    border: "1px solid #cbd5e1",
                    // padding: "0 14px",
                    outline: "none",
                    backgroundColor: "#fff",
                    fontSize: "12px",
                    color: "#0f172a",
                }}
            >
                <option value="">CHOOSE EMPLOYEES</option>
                {employees?.map((emp) => (
                    <option style={{ fontSize: '12px' }} key={emp?.user_id} value={emp?.user_id}>
                        {emp?.name?.toUpperCase()}
                    </option>
                ))}
            </select>
        </Box>
    );
};

export default EmployeeSelect;