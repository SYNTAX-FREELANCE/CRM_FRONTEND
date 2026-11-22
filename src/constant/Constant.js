import { toast } from "react-toastify";

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
