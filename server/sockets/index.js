import * as utils from "./utils.js";

const socketRoomMap = new Map();

const quesArr = [
  {
    type: "PATTERN",
    time: 30,
    q: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619620533832x433131910406034500/Q1.svg",
    A: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619620616027x749775513973640600/Q%201%20A%20%281%29.svg",
    B: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619620604000x436440903663458400/Q%201%20A%20%282%29.svg",
    C: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619620628324x813131711903281900/Q%201%20A%20%283%29.svg",
    D: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619620647449x949628165349358000/Q%201%20A%20%284%29.svg",
    ans: "A",
  },
  {
    type: "PATTERN",
    time: 25,
    q: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619611958813x303368106426746600/Q-01.svg",
    A: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619612017708x318234080959034500/Q-02.svg",
    B: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619612038426x989591692011166200/Q-03.svg",
    C: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619621354436x983135457868009200/Q-03.svg",
    D: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619621335445x643859524396502800/Q-04.svg",
    ans: "B",
  },
  {
    type: "PATTERN",
    time: 20,
    q: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619622838404x770376798705511300/Q3.svg",
    A: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619622871266x487571820856178600/Q%203%20A%20%281%29.svg",
    B: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619622884080x109847414543593490/Q%203%20A%20%282%29.svg",
    C: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619622894966x491590834046897700/Q%203%20A%20%283%29.svg",
    D: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619622905548x566558871071154400/Q%203%20A%20%284%29.svg",
    ans: "C",
  },
  {
    type: "PATTERN",
    time: 40,
    q: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619612164401x306501931139286920/Q-06.svg",
    A: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619612188661x664850454619189400/Q-07.svg",
    B: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619612206726x152477936947297500/Q-08.svg",
    C: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619612220629x748943399782868100/Q-09.svg",
    D: "https://f867b987572fb5d41ec60f5cee22021a.cdn.bubble.io/f1619612230359x380918791418798340/Q-10.svg",
    ans: "C",
  },
  {
    type: "TEXT",
    time: 350000000000000,
    q: "What is my name",
    A: "Ajay",
    B: "Abhishek",
    C: "Hritik",
    D: "Siva Sai",
    ans: "A",
  },
];

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
  socket.to(data.room).emit("send_questions" , quesArr);
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