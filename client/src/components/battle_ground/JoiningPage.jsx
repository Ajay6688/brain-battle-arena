import "../../../src/App.css";
import "../../styles/JoiningPage.css";
import io from "socket.io-client";
import { useState } from "react";
import { BattleGroundPage } from "./BattleGroundPage";

const socket = io.connect("http://localhost:4000");

export const JoiningPage = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState({ room: "", username: "" });
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    socket.emit("join_room", { room: room, username: username });
    setShowChat(true);
    localStorage.setItem("username", username);
    localStorage.setItem("room", room.room);
  };

  const generateRoomId = () => {
    // Generate a random room ID or use any unique identifier logic
    return Math.random().toString(36).substring(7);
  };

  const [isCreateRoom, setIsCreateRoom] = useState(true);

  const toggleCreateRoom = () => {
    setIsCreateRoom(false);
  };

  const toggleJoinRoom = () => {
    setIsCreateRoom(true);
  };

  return (
    <>
      <div className="App">
        {!showChat ? (
          <div>
            <div className="form-modal">
              <div className="form-toggle">
                <button
                  id="login-toggle"
                  onClick={toggleJoinRoom}
                  style={{
                    backgroundColor: isCreateRoom ? "#57B846" : "#fff",
                    color: isCreateRoom ? "#fff" : "#222",
                  }}
                >
                  Create A Room
                </button>
                <button
                  id="signup-toggle"
                  onClick={toggleCreateRoom}
                  style={{
                    backgroundColor: isCreateRoom ? "#fff" : "#57B846",
                    color: isCreateRoom ? "#222" : "#fff",
                  }}
                >
                  Join A Room
                </button>
              </div>

              {isCreateRoom ? (
                <div id="login-form">
                  <form>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      required
                      onChange={(event) => {
                        setUsername(event.target.value.trim());
                        const roomId = generateRoomId();
                        setRoom({
                          room: roomId,
                          username: event.target.value.trim(),
                          isHost: true,
                        });
                      }}
                    />
                    <button
                      type="submit"
                      className="btn login"
                      onClick={joinRoom}
                    >
                      Create A Room
                    </button>
                    <hr />
                    <p>Learn together , Grow together</p>
                  </form>
                </div>
              ) : (
                <div id="signup-form">
                  <form>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      required
                      onChange={(event) => {
                        setUsername(event.target.value.trim());
                        setRoom((prev) => {
                          return {
                            ...prev,
                            username: event.target.value.trim(),
                          };
                        });
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Enter Room Id"
                      required
                      onChange={(event) => {
                        setRoom({
                          room: event.target.value.trim(),
                          username: username,
                          isHost: false,
                        });
                      }}
                    />
                    <button
                      type="submit"
                      className="btn signup"
                      onClick={joinRoom}
                    >
                      Join A Room
                    </button>
                    <hr />
                    <p>Learn together , Grow together</p>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          <BattleGroundPage socket={socket} username={username} room={room} />
        )}
      </div>
    </>
  );
};
