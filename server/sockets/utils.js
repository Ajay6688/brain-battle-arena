
export function getActiveUsers(io ,room) {
  const users = [];
  const sockets = io.sockets.adapter.rooms.get(room);
  if (sockets) {
    for (const socketId of sockets) {
      const user = {
        id: socketId,
        username: getUsernameBySocketId(io ,socketId),
      };
      users.push(user);
    }
  }
  return users;
}

export function getUsernameBySocketId(io ,socketId) {
  const socket = io.sockets.sockets.get(socketId);
  console.log("username with socket id ", socket.username);
  return socket.username;
}
