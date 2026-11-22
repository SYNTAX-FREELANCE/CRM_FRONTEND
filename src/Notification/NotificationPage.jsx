
import React, { useMemo, useState } from "react";

import {
    Box,
    useTheme,
} from "@mui/material";

import { alpha } from "@mui/material/styles";

import { axioslogin } from "../Connection/axios";

import {
    confirmNotify,
    errorNotify,
    getAuthUser,
    infoNotify,
    successNotify,
    warningNotify,
} from "../constant/Constant";

import {
    useRoleMaster,
    useAllEmployeeDetails,
    useSentNotifications,
    useReceivedNotifications,
} from "../CommonCode/useQuery";

import NotificationHeader from "./NotificationComponents/NotificationHeader";
import NotificationTabs from "./NotificationComponents/NotificationTabs";
import CreateNotification from "./NotificationComponents/CreateNotification";
import SentNotifications from "./NotificationComponents/SentNotifications";

import { getNotificationTheme } from "./NotificationTheme/notificationTheme";

const API = "/notifications";

const NotificationPage = () => {

    const theme = useTheme();

    const colors = useMemo(
        () => ({
            ...getNotificationTheme(theme),
            danger: theme.palette.error.main,
        }),
        [theme]
    );

    // ==========================================
    // MASTER DATA
    // ==========================================

    const { data: RoleMasterDetil = [] } = useRoleMaster();

    const { data: employeeListData = [] } = useAllEmployeeDetails();

    // ==========================================
    // AUTH
    // ==========================================

    const authUser = getAuthUser();

    const { id, role } = authUser ?? {};

    const isAdmin = role?.toLowerCase() === "admin";

    // ==========================================
    // STATES
    // ==========================================

    const [activeTab, setActiveTab] = useState(isAdmin ? 0 : 1);



    const [sending, setSending] = useState(false);

    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        notification_type: "GENERAL",
        audience_type: "ALL",
        audience_role: "",
        expires_at: "",
    });

    // ==========================================
    // EMPLOYEES
    // ==========================================

    const activeEmployees = useMemo(() => {

        return employeeListData?.filter(
            (employee) =>
                String(employee.status_name || "").toUpperCase() === "ACTIVE"
        );

    }, [employeeListData]);

    // ==========================================
    // ROLES
    // ==========================================

    const activeRoles = useMemo(() => {

        return RoleMasterDetil.filter(
            (role) => Number(role.is_active) === 1
        );

    }, [RoleMasterDetil]);

    // ==========================================
    // SENT NOTIFICATIONS
    // ==========================================

    const {
        data: notifications = [],
        isLoading: loading,
        refetch: RefetchNotifications,
    } = useSentNotifications(id);

    const {
        data: receivedNotifications = [],
        isLoading: receivedLoading,
        refetch: RefetchReceivedNotifications,
    } = useReceivedNotifications(id);

    const Notifications = isAdmin
        ? notifications
        : receivedNotifications;




    const notificationLoading = isAdmin
        ? loading
        : receivedLoading;

    const refetch = isAdmin
        ? RefetchNotifications
        : RefetchReceivedNotifications;

    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleFormChange = (event) => {

        const { name, value } = event.target;

        if (name === "audience_type") {

            setSelectedEmployees([]);

            setFormData((prev) => ({
                ...prev,
                audience_type: value,
                audience_role: "",
            }));

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    // ==========================================
    // SEND NOTIFICATION
    // ==========================================

    const handleSendNotification = async () => {

        if (!formData.title.trim()) {
            warningNotify("Please enter notification title");
            return;
        }

        if (!formData.message.trim()) {
            warningNotify("Please enter notification message");
            return;
        }

        if (
            formData.audience_type === "ROLE" &&
            !formData.audience_role
        ) {
            warningNotify("Please select a role");
            return;
        }

        if (
            formData.audience_type === "SELECTED" &&
            selectedEmployees.length === 0
        ) {
            warningNotify("Please select at least one active employee");
            return;
        }

        try {

            setSending(true);

            const payload = {
                title: formData.title.trim(),
                message: formData.message.trim(),

                notification_type: formData.notification_type,
                audience_type: formData.audience_type,

                audience_role:
                    formData.audience_type === "ROLE"
                        ? formData.audience_role
                        : null,

                employee_ids:
                    formData.audience_type === "SELECTED"
                        ? selectedEmployees.map(
                            (employee) => Number(employee.user_id)
                        )
                        : [],

                expires_at: formData.expires_at || null,
            };

            const response = await axioslogin.post(
                `${API}/send`,
                payload
            );

            if (response.data?.success) {

                successNotify(
                    `Notification sent successfully to ${response.data.data?.total_recipients || 0
                    } employees`
                );

                setFormData({
                    title: "",
                    message: "",
                    notification_type: "GENERAL",
                    audience_type: "ALL",
                    audience_role: "",
                    expires_at: "",
                });

                setSelectedEmployees([]);

                await refetch();

                setActiveTab(1);

            }

        } catch (error) {

            console.error("Send notification error:", error);

            errorNotify(
                error.response?.data?.message ||
                "Failed to send notification"
            );

        } finally {

            setSending(false);

        }

    };

    // ==========================================
    // DELETE NOTIFICATION
    // ==========================================

    const handleDeleteNotification = async (notificationId, userId) => {
        if (!notificationId) return infoNotify("Notification Id is Missing");
        if (!userId) return infoNotify("Invalid User Please Login again")
        const confirmed = await confirmNotify(
            "Are you sure you want to delete this notification?"
        );

        if (!confirmed) return;

        const middle = isAdmin ? "remove" : "delete";

        try {

            const response = await axioslogin.put(
                `${API}/${middle}/${notificationId}/${userId}`
            );

            if (response.data?.success) {

                // successNotify("Notification deleted successfully");
                await refetch();
            }

        } catch (error) {

            console.error("Delete notification error:", error);

            errorNotify(
                error.response?.data?.message ||
                "Failed to delete notification"
            );

        }

    };

    //Mark Single NOtification As Marked
    const handleMarkAsRead = async (notificationId, userId) => {
        if (!notificationId) return infoNotify("Notification Id is Missing");

        if (!userId) return infoNotify("Invalid User Please Login again");

        try {
            const response = await axioslogin.post(
                `${API}/read/${notificationId}/${userId}`
            );

            if (response.data?.success) {
                // successNotify("Notification deleted successfully");
                await refetch();
            }

        } catch (error) {
            console.error("Delete notification error:", error);
            errorNotify(
                error.response?.data?.message ||
                "Failed to Mark notification As Read"
            );

        }

    };

    // Mark All As Read
    const handleMarkAllAsRead = async () => {
        if (!id) return infoNotify("User is Not Valid!")
        try {
            const response = await axioslogin.post(
                `${API}/read-all/${id}`
            );
            if (response.data?.success) {
                successNotify("All Meassage Mark as Read!");
                await refetch();
            }
        } catch (error) {
            console.error("Delete notification error:", error);
            errorNotify(
                error.response?.data?.message ||
                "Failed to Mark notifications As Read"
            );

        }

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) return "";

        const parsedDate = new Date(
            String(date).replace(" ", "T")
        );

        if (Number.isNaN(parsedDate.getTime())) return "";

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    };

    // ==========================================
    // AUDIENCE LABEL
    // ==========================================

    const getAudienceLabel = (item) => {

        if (item.audience_type === "ALL") {
            return "All Active Employees";
        }

        if (item.audience_type === "ROLE") {
            return item.audience_role || "Specific Role";
        }

        if (item.audience_type === "SELECTED") {
            return "Selected Employees";
        }

        return item.audience_type || "General";

    };

    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <Box
            sx={{
                // px: { xs: 1.5, sm: 2, md: 3 },
                minHeight: "100%",
                bgcolor: 'transparent',
                transition: "background-color 0.2s ease",
            }}
        >

            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,

                    background:
                        theme.palette.mode === "dark"
                            ? "rgba(20, 83, 45, 0.55)"
                            : "rgba(220, 252, 231, 0.72)",

                    backdropFilter: "blur(18px) saturate(180%)",
                    WebkitBackdropFilter: "blur(18px) saturate(180%)",

                    p: 2,
                    mb: 2,

                    border: "1px solid",
                    borderColor:
                        theme.palette.mode === "dark"
                            ? "rgba(134, 239, 172, 0.18)"
                            : "rgba(22, 163, 74, 0.18)",

                    borderRadius: "14px",

                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "0 8px 30px rgba(0, 0, 0, 0.18)"
                            : "0 8px 30px rgba(22, 163, 74, 0.08)",

                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        borderRadius: "inherit",
                        background:
                            "linear-gradient(135deg, rgba(255,255,255,0.35), transparent 55%)",
                        pointerEvents: "none",
                    },
                }}
            >
                <NotificationHeader
                    colors={colors}
                    onRefresh={refetch}
                />

                <NotificationTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    colors={colors}
                    isAdmin={isAdmin}
                    markall={handleMarkAllAsRead}
                />
            </Box>

            {activeTab === 0 && isAdmin && (

                <CreateNotification
                    formData={formData}
                    setFormData={setFormData}
                    handleFormChange={handleFormChange}
                    activeEmployees={activeEmployees}
                    activeRoles={activeRoles}
                    selectedEmployees={selectedEmployees}
                    setSelectedEmployees={setSelectedEmployees}
                    sending={sending}
                    handleSendNotification={handleSendNotification}
                    colors={colors}
                />

            )}

            {activeTab === 1 && (

                <SentNotifications
                    notifications={Notifications}
                    loading={notificationLoading}
                    colors={colors}
                    formatDate={formatDate}
                    getAudienceLabel={getAudienceLabel}
                    handleDeleteNotification={handleDeleteNotification}
                    handleMarkAsRead={handleMarkAsRead}
                    userId={id}
                    setActiveTab={setActiveTab}
                />

            )}

        </Box>

    );

};

export default NotificationPage;
