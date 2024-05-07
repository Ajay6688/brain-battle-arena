import "../../../src/App.css";
import "../../styles/JoiningPage.css";
import "../../styles/BattleGroundPage.css";
import io from "socket.io-client";
import { useState } from "react";
import { BattleGroundPage } from "./BattleGroundPage";

const socket = io.connect("http://13.127.235.89:5000");
// const socket = io.connect("http://localhost:5000");

export const JoiningPage = () => {
  // const { category } = useParams();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState({ room: "", username: "" });
  const [showChat, setShowChat] = useState(false);
  const [isCreateRoom, setIsCreateRoom] = useState(true);
  const [categoryId, setCategoryId] = useState();
  const [category, setCategory] = useState("");

  const joinRoom = () => {
    socket.emit("join_room", { room: room, username: username });
    setShowChat(true);
    localStorage.setItem("username", username);
    localStorage.setItem("room", room.room);
  };

  const generateRoomId = () => {
    // Generate a random room ID or use any unique identifier logic
    return Math.random().toString(36).substring(7) + category;
  };

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
          <section>
            <div className="main">
              <div className="first-section">
                <h1>Brain Battle Arena</h1>
              </div>
              <div style={{ position: "relative" }}>
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
                        <select
                          name="cars"
                          className="choose-category-container"
                          defaultValue="Choose Category"
                          onChange={(event) => setCategory(event.target.value)}
                        >
                          <option disabled>Choose Category</option>
                          <option value="0">DSA</option>
                          <option value="1">Aptitude</option>
                          <option value="2">Java</option>
                        </select>
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
                          onClick={() => {
                            setCategoryId(null);
                            joinRoom();
                          }}
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
                            setCategoryId(
                              event.target.value
                                .trim()
                                .charAt(event.target.value.trim().length - 1)
                            );
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
            </div>
          </section>
        ) : (
          <BattleGroundPage
            socket={socket}
            username={username}
            room={room}
            questionsCategory={category}
            categoryId={categoryId}
          />
        )}
      </div>
    </>
  );
};
