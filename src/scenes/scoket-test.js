// socket-test.js
const { io } = require("socket.io-client");

const socket = io("ws://127.0.0.1:8082", {
  path: "/socket.io/",
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
  // Send test event
  socket.emit("joinRoom", { experienceid: "test", crmid: "room1" });
});

socket.on("receiveMessage", (msg) => {
  console.log("📩 Received message:", msg);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});
