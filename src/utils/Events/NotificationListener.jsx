
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../Socket/socket";
import { playNotificationSound } from "./notificationSound";
import { showNotificationToast } from "../../constant/Constant";

const showDesktopNotification = (notification) => {
    if (!("Notification" in window)) {
        // console.log("Browser does not support notifications");
        return;
    }

    // Don't show desktop popup when CRM is currently visible
    if (document.visibilityState === "visible") {
        // console.log("CRM is active. Skipping desktop notification.");
        return;
    }

    if (Notification.permission !== "granted") {
        // console.log("Notification permission not granted");
        return;
    }

    try {
        const desktopNotification = new Notification(
            notification.title || "CRM Notification",
            {
                body: notification.message || "You have a new update",
                icon: `${window.location.origin}/favicon.png`,
                badge: `${window.location.origin}/favicon.png`,
                tag: `crm-${notification.notification_id}`,
                timestamp: notification.created_at
                    ? new Date(notification.created_at).getTime()
                    : Date.now(),
                silent: true,
                renotify: true,
            }
        );

        desktopNotification.onclick = () => {
            window.focus();
            desktopNotification.close();

            // Optionally navigate to your CRM notification page
            // window.location.href = "/notifications";
        };

        desktopNotification.onshow = () => {
            console.log("CRM notification displayed");
        };

        desktopNotification.onerror = (event) => {
            console.error("Desktop notification error:", event);
        };

    } catch (error) {
        console.error("Unable to create desktop notification:", error);
    }
};

const NotificationListener = ({ userId }) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!userId) return;

        const joinRoom = () => {
            console.log("Joining notification room:", userId);
            socket.emit("join", String(userId));
        };

        const handleNewNotification = (notification) => {
            console.log("Socket notification received:", notification);

            if (!notification?.notification_id) return;

            playNotificationSound();

            showDesktopNotification(notification);
            // Show custom CRM toast only when the user is actively in CRM
            if (document.visibilityState === "visible") {
                showNotificationToast(notification);
            }

            queryClient.invalidateQueries({
                queryKey: ["received-notifications"],
            });

            if (
                "Notification" in window &&
                Notification.permission === "default"
            ) {
                window.dispatchEvent(
                    new Event("CRM_NEW_NOTIFICATION")
                );
            }
        };

        socket.on("connect", joinRoom);
        socket.on("NEW_NOTIFICATION", handleNewNotification);

        if (socket.connected) {
            joinRoom();
        }

        return () => {
            socket.off("connect", joinRoom);
            socket.off("NEW_NOTIFICATION", handleNewNotification);
        };
    }, [userId, queryClient]);

    return null;
};

export default NotificationListener;
