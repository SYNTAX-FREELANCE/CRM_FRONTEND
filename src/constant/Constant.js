import { toast } from "react-toastify";
import {
  NotificationsActiveRounded,
  CloseRounded,
  AccessTimeRounded,
} from "@mui/icons-material";


const baseOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/* INFO */
export const infoNotify = (message) => {
  toast.info(message, baseOptions);
};

/* SUCCESS */
export const successNotify = (message) => {
  toast.success(message, baseOptions);
};

/* WARNING */
export const warningNotify = (message) => {
  toast.warning(message, baseOptions);
};

export const warningNofity = warningNotify;

/* ERROR */
export const errorNotify = (message) => {
  toast.error(message, baseOptions);
};

// utils/getAuthUser.js (or wherever your getAuthUser is)
export const getAuthUser = () => {
  try {
    const storedUser = localStorage.getItem("user"); // Changed from "authUser" to "user"

    if (!storedUser) return null;

    // Decrypt using atob (reverse of btoa)
    const decryptedUser = JSON.parse(atob(storedUser));

    // Return the user object with role, id, and name
    return {
      id: Number(decryptedUser.id), // user_id from users table
      emp_name: decryptedUser.username, // name from users_master
      role: decryptedUser.role, // role name
      role_id: decryptedUser.role_id, // role name
    };
  } catch (error) {
    console.error("Invalid user in localStorage:", error);
    localStorage.removeItem("user"); // Clear invalid data
    return null;
  }
};

export const confirmNotify = (message) => {
  return new Promise((resolve) => {
    let completed = false;

    const finish = (value) => {
      if (completed) return;
      completed = true;
      resolve(value);
    };

    toast(
      ({ closeToast }) => (
        <div
          style={{
            padding: "8px 4px",
            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                minWidth: "38px",
                height: "38px",
                borderRadius: "12px",
                background: "rgba(22, 163, 74, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#16a34a",
                fontSize: "20px",
              }}
            >
              !
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--toastify-color-dark, inherit)",
                  marginBottom: "5px",
                }}
              >
                Confirm Action
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "inherit",
                  opacity: 0.8,
                }}
              >
                {message}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              onClick={() => {
                finish(false);
                closeToast();
              }}
              style={{
                border: "1px solid rgba(128,128,128,0.3)",
                background: "transparent",
                color: "inherit",
                borderRadius: "9px",
                padding: "9px 18px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                finish(true);
                closeToast();
              }}
              style={{
                border: "none",
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                color: "#ffffff",
                borderRadius: "9px",
                padding: "9px 20px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(22,163,74,0.22)",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      {
        ...baseOptions,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        onClose: () => finish(false),
      },
    );
  });
};







export const showNotificationToast = (notification) => {
  const {
    notification_id,
    title,
    message,
    notification_type,
    created_at,
  } = notification;

  const time = created_at
    ? new Date(created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "Just now";

  toast(
    ({ closeToast }) => (
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          padding: "3px 2px",
          fontFamily: "inherit",
          width: "100%",
        }}
      >
        {/* Notification Icon */}
        <div
          style={{
            width: "38px",
            height: "38px",
            minWidth: "38px",
            borderRadius: "50%",
            background: "rgba(37,99,235,0.12)",
            color: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NotificationsActiveRounded
            style={{ fontSize: 21 }}
          />
        </div>

        {/* Notification Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.8px",
                  color: "#3b82f6",
                }}
              >
                CRM ALERT
              </span>

              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#16a34a",
                  background: "rgba(22,163,74,0.10)",
                  padding: "3px 6px",
                  borderRadius: "4px",
                }}
              >
                NEW
              </span>
            </div>

            <button
              onClick={closeToast}
              style={{
                border: "none",
                background: "transparent",
                color: "inherit",
                opacity: 0.5,
                cursor: "pointer",
                padding: "0",
                display: "flex",
              }}
            >
              <CloseRounded style={{ fontSize: 17 }} />
            </button>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: 750,
              lineHeight: 1.4,
              color: "inherit",
              marginBottom: "4px",
              overflowWrap: "anywhere",
            }}
          >
            {title || "New Notification"}
          </div>

          {/* Message */}
          <div
            style={{
              fontSize: "12px",
              lineHeight: 1.5,
              opacity: 0.72,
              color: "inherit",
              overflowWrap: "anywhere",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {message || "You have received a new update."}
          </div>

          {/* Bottom metadata */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginTop: "9px",
              fontSize: "10px",
              opacity: 0.6,
            }}
          >
            <span style={{ fontWeight: 700 }}>
              {notification_type || "GENERAL"}
            </span>

            <span>•</span>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <AccessTimeRounded
                style={{ fontSize: 12 }}
              />
              {time}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...baseOptions,
      toastId: `crm-notification-${notification_id}`,
      autoClose: 5500,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      position: "top-right",
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      style: {
        borderRadius: "12px",
        padding: "13px 14px",
        width: "360px",
        maxWidth: "calc(100vw - 30px)",
        minHeight: "auto",
        border: "1px solid rgba(128,128,128,0.16)",
        borderLeft: "3px solid #3b82f6",
        boxShadow: "0 5px 22px rgba(0,0,0,0.13)",
      },
    }
  );
};

