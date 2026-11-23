
let notificationAudio;

export const enableNotificationSound = async () => {
    try {
        notificationAudio = new Audio("/sounds/notification.mp3");
        notificationAudio.volume = 0.7;

        await notificationAudio.play();

        notificationAudio.pause();
        notificationAudio.currentTime = 0;

        localStorage.setItem("notificationSoundEnabled", "true");

        return true;
    } catch (error) {
        console.error("Unable to enable notification sound:", error);
        return false;
    }
};

export const playNotificationSound = () => {
    if (localStorage.getItem("notificationSoundEnabled") !== "true") {
        return;
    }

    try {
        if (!notificationAudio) {
            notificationAudio = new Audio("/sounds/notification.mp3");
            notificationAudio.volume = 0.7;
        }

        notificationAudio.currentTime = 0;
        notificationAudio.play().catch(console.error);

    } catch (error) {
        console.error(error);
    }
};