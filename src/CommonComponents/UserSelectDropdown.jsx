import React, { useState, useEffect } from "react";
import { Box } from "@mui/joy";
import { FetchAllEmployeeMaster } from "../CommonCode/CommonFun";

/**
 * UserSelectDropdown Component
 * 
 * Fetches user records from `users_master` table and renders a select dropdown.
 * Table: users_master
 * Fields available: user_id, employee_id, name, age, gender, qualification_id, 
 * date_of_join, experience, mobile_number_1, mobile_number_2, aadhar_number, 
 * company_id, role_id, user_status, is_active, created_at, updated_at, is_admin, 
 * dob, email, address, otp
 */
const UserSelectDropdown = ({
    value,
    onChange,
    placeholder = "Select Employee",
    valueKey = "employee_id", // 'employee_id' or 'user_id'
    usersList = null,          // optional pre-fetched users array from users_master
    isDark = false,
    inputBg,
    inputTextColor,
    inputBorder,
    disabled = false,
    required = false,
    size = "md",
    sx = {}
}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usersList && Array.isArray(usersList)) {
            setUsers(usersList);
        } else {
            const loadUsers = async () => {
                try {
                    setLoading(true);
                    const data = await FetchAllEmployeeMaster();
                    setUsers(data || []);
                } catch (err) {
                    console.error("Error loading users for UserSelectDropdown:", err);
                    setUsers([]);
                } finally {
                    setLoading(false);
                }
            };
            loadUsers();
        }
    }, [usersList]);

    const handleChange = (e) => {
        const selectedVal = e.target.value;
        if (onChange) {
            onChange(selectedVal, e);
        }
    };

    const bgColor = inputBg || (isDark ? "#1e293b" : "#f8fafc");
    const textColor = inputTextColor || (isDark ? "#f8fafc" : "#0f172a");
    const borderColor = inputBorder || (isDark ? "#334155" : "1px solid #cbd5e1");

    return (
        <Box sx={{ width: "100%", ...sx }}>
            <select
                value={value || ""}
                onChange={handleChange}
                disabled={disabled || loading}
                required={required}
                style={{
                    width: "100%",
                    height: size === "small" || size === "sm" ? "36px" : "40px",
                    borderRadius: "12px",
                    border: typeof borderColor === "string" && borderColor.includes("solid") 
                        ? borderColor 
                        : `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    padding: "0 12px",
                    fontSize: "14px",
                    fontWeight: 500,
                    outline: "none",
                    cursor: disabled || loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease-in-out",
                }}
            >
                <option value="" style={{ backgroundColor: bgColor, color: textColor }}>
                    {loading ? "Loading employees..." : `-- ${placeholder} --`}
                </option>
                {users.map((user) => {
                    const optValue = user[valueKey] || user.employee_id || user.user_id;
                    const empCode = user.employee_id ? ` (${user.employee_id})` : "";
                    const displayName = `${user.name || "Unknown"}${empCode}`;

                    return (
                        <option
                            key={user.user_id || user.employee_id}
                            value={optValue}
                            style={{ backgroundColor: bgColor, color: textColor }}
                        >
                            {displayName}
                        </option>
                    );
                })}
            </select>
        </Box>
    );
};

export default UserSelectDropdown;
