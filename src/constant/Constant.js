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
      id: Number(decryptedUser.id),           // user_id from users table
      emp_name: decryptedUser.username,// name from users_master
      role: decryptedUser.role,         // role name
      role_id: decryptedUser.role_id,         // role name
    };
  } catch (error) {
    console.error("Invalid user in localStorage:", error);
    localStorage.removeItem("user"); // Clear invalid data
    return null;
  }
};