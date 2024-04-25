import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import * as sct from "./sockets/index.js";

const app = express();

app.use(cors());
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {

  console.log("User Connected ", socket.id);

  socket.on("join_room", (data) => sct.joinRoom(io, socket, data)); 
  socket.on("send_message", (data) => sct.sendMessage(io, socket, data));
  socket.on("user_ready" , (data)=> sct.sendUserReadyMessage(socket, data));
  socket.on("start_game" , (data)=> sct.sendStartGameMessage(socket, data));
  socket.on("submit_answer" , (data)=>sct.sendSubmitAnswer(socket , data));
  socket.on("send_questions" , (data)=>sct.sendQuestion(socket , data));
  socket.on("send_score" , (data)=>sct.sendScore(socket , data));
  socket.on("disconnect", () => sct.disconnect(io, socket)); 
});

server.listen(PORT, () => console.log(`server is running at port ${PORT}`));
