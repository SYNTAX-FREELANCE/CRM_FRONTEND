import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../Socket/socket";


const NotificationListener = ({ userId }) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!userId) return;

        const joinRoom = () => {
            socket.emit("join", String(userId));
        };

        const handleNewNotification = (notification) => {
            // Only handle notifications addressed to this user
            if (!notification?.notification_id) return;

            queryClient.invalidateQueries({
                queryKey: ["received-notifications"],
            });
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