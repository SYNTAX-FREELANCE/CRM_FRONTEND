// frontend/src/socket.js
import { io } from "socket.io-client";
import { LIVE_SOCKET_URL } from "../../constant/Static";

// const SOCKET_URL = "http://localhost:7000"; // your backend
const SOCKET_URL = LIVE_SOCKET_URL || "http://localhost:7000";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: true,
});
