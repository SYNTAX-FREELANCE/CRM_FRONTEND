import React from "react";
import { Box } from "@mui/joy";
import { useTheme } from "@mui/material";

const MultiEmployeeSelect = ({
    value = [],
    onChange,
    employees = [],
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const handleChange = (e) => {
        const selectedValues = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );

        onChange(selectedValues);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <select
                multiple
                value={value}
                onChange={handleChange}
                style={{
                    width: "100%",
                    minHeight: "120px",
                    border: isDark
                        ? "1px solid rgba(255,255,255,0.2)"
                        : "1px solid #cbd5e1",
                    outline: "none",
                    backgroundColor: isDark ? "#1e293b" : "#fff",
                    color: isDark ? "#f8fafc" : "#0f172a",
                    borderRadius: "4px",
                    fontSize: "12px",
                    padding: "4px",
                }}
            >
                {employees?.map((emp) => (
                    <option
                        key={emp.user_id}
                        value={emp.user_id}
                        style={{
                            fontSize: "12px",
                            padding: "6px",
                            backgroundColor: isDark ? "#1e293b" : "#fff",
                            color: isDark ? "#f8fafc" : "#0f172a",
                        }}
                    >
                        {emp.name?.toUpperCase()}
                    </option>
                ))}
            </select>
        </Box>
    );
};

export default MultiEmployeeSelect;