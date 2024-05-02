import { questionStoreAptitude, questionsStoreDSA } from "../questions_store/inde.js";
import * as utils from "./utils.js";

const socketRoomMap = new Map();

const quesArr = [
  questionsStoreDSA.questions,
  questionStoreAptitude.questions,
]

// for join room
export const joinRoom = (io, socket, data) => { 
    socket.join(data.room.room);
    socket.username = data.room.username; 
    socketRoomMap.set(socket.id, data.room.room);
    console.log(data);
    io.to(data.room.room).emit("user_joined", {
      activeUsers: utils.getActiveUsers(io, data.room.room),
      user : data.room
    });
    console.log(`User with id : ${socket.id} joined room : ${data.room.room}`);
}

// for send message 
export const sendMessage = ( socket, data) => {
    socket.to(data.room.room).emit("receive_message", data);
}

export const sendUserReadyMessage = (socket , data)=>{
  socket.to(data.room.room).emit("user_ready" , data);
}

export const sendStartGameMessage = (socket , data)=>{
  socket.to(data.room.room).emit("start_game" , data);
}

export const sendSubmitAnswer = (socket , data)=>{
    socket.to(data.room).emit("submit_answer", data);
}

export const sendQuestion =  (socket , data)=>{
  socket.to(data.room).emit("send_questions" , quesArr[data.category]);
}

export const sendScore = (socket , data ) => {
  socket.to(data.room).emit("send_score" , data);
}

// for disconnect
export const disconnect = (io, socket) => {
    const room = socketRoomMap.get(socket.id);
    if (room) {
      io.to(room).emit("user_left", { activeUsers: utils.getActiveUsers(io, room) }); 
    }
    console.log("User Disconnected", socket.id);
    socketRoomMap.delete(socket.id);
};