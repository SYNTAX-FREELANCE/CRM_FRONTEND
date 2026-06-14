// frontend/src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:7000"; // your backend

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});