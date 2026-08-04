import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/joy";
import { FetchAllEmployeeMaster } from "../CommonCode/CommonFun";
import { useAuth } from "../Context/AuthContext";
import { getAuthUser } from "../constant/Constant";

/**
 * UserSelectDropdown Component
 * 
 * Fetches user records from `users_master` table and renders a select dropdown.
 * If Admin is logged in, displays all employees.
 * Otherwise, displays only the logged-in employee.
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

    const { user: authContextUser } = useAuth();
    const authUser = getAuthUser();

    const userRole = (authContextUser?.role || authUser?.role || "").trim().toLowerCase();

    // If role is explicitly "employee", show only that logged-in employee.
    // For any other role (Admin, Manager, Team Lead, HR, etc.), show all employees.
    const isEmployeeOnly = userRole === "employee" && authContextUser?.is_admin !== 1 && authUser?.is_admin !== 1;
    const canSeeAll = !isEmployeeOnly;

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

    const displayUsers = useMemo(() => {
        if (!users || !Array.isArray(users)) return [];

        if (canSeeAll) {
            return users;
        }

        // Non-admin employee: filter to show ONLY the logged-in employee
        const loggedUserId = authContextUser?.id || authContextUser?.user_id || authUser?.id;
        const loggedEmpId = authContextUser?.employee_id || authContextUser?.emp_id || authContextUser?.username;
        const loggedEmpName = authContextUser?.username || authUser?.emp_name;

        const filtered = users.filter((u) => {
            if (loggedUserId && Number(u.user_id) === Number(loggedUserId)) return true;
            if (loggedEmpId && String(u.employee_id).toLowerCase() === String(loggedEmpId).toLowerCase()) return true;
            if (loggedEmpName && u.name && u.name.toLowerCase() === loggedEmpName.toLowerCase()) return true;
            return false;
        });

        if (filtered.length > 0) return filtered;

        // Fallback if user object exists but not matched in fetched array
        if (loggedUserId || loggedEmpId || loggedEmpName) {
            return [
                {
                    user_id: loggedUserId || 1,
                    employee_id: loggedEmpId || "EMP",
                    name: loggedEmpName || "Logged-in Employee",
                },
            ];
        }

        return users;
    }, [users, canSeeAll, authContextUser, authUser]);

    useEffect(() => {
        if (!canSeeAll && displayUsers.length > 0 && onChange) {
            const singleUser = displayUsers[0];
            const targetVal = singleUser[valueKey] || singleUser.employee_id || singleUser.user_id;
            if (targetVal && String(value) !== String(targetVal)) {
                onChange(String(targetVal));
            }
        }
    }, [canSeeAll, displayUsers, valueKey, value, onChange]);

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
                {canSeeAll && (
                    <option value="" style={{ backgroundColor: bgColor, color: textColor }}>
                        {loading ? "Loading employees..." : `-- ${placeholder} --`}
                    </option>
                )}
                {displayUsers.map((user) => {
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
