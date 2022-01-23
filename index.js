const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
// app.use(router);
let users = [];

io.on('connection', (socket) => {
 //when ceonnect
 console.log("a user connected.");

 //take userId and socketId from user
 socket.on("addUser", (userId) => {
   addUser(userId, socket.id);
   io.emit("getUsers", users);
 });

 //send and get message
 socket.on("sendMessage", ({ senderId, receiverId, text }) => {
   const user = getUser(receiverId);
   io.to(user.socketId).emit("getMessage", {
     senderId,
     text,
   });
 });

 //when disconnect
 socket.on("disconnect", () => {
   console.log("a user disconnected!");
   removeUser(socket.id);
   io.emit("getUsers", users);
 });
});

// const io = require("socket.io")(port, {
//   cors: {
//     origin: "https://chat-app-4u.netlify.app/",
//   },
// });
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
    
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId ===  userId);
};

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));

