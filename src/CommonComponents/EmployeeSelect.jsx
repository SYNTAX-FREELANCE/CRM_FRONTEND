import React from "react";
import { Box } from "@mui/joy";
import { useTheme } from "@mui/material";

const EmployeeSelect = ({ value, onChange, employees = [] }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ width: "100%" }}>
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    height: "30px",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid #cbd5e1",
                    outline: "none",
                    backgroundColor: isDark ? "#1e293b" : "#fff",
                    fontSize: "12px",
                    color: isDark ? "#f8fafc" : "#0f172a",
                    borderRadius: "4px",
                }}
            >
                <option value="" style={{ backgroundColor: isDark ? "#1e293b" : "#fff", color: isDark ? "#f8fafc" : "#0f172a" }}>
                    CHOOSE EMPLOYEES
                </option>
                {employees?.map((emp) => (
                    <option
                        style={{
                            fontSize: '12px',
                            backgroundColor: isDark ? "#1e293b" : "#fff",
                            color: isDark ? "#f8fafc" : "#0f172a"
                        }}
                        key={emp?.user_id}
                        value={emp?.user_id}
                    >
                        {emp?.name?.toUpperCase()}
                    </option>
                ))}
            </select>
        </Box>
    );
};

export default EmployeeSelect;