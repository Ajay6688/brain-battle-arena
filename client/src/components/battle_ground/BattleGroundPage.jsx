import React, { useEffect, useState } from "react";
import QuizBattle from "./QuizBattle";

export const BattleGroundPage = ({ socket, username, room }) => {
  const [activeUsersList, setActiveUsersList] = useState([]);
  const [startButtonBackground, setStartButtonBackground] = useState({});
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartGame = () => {
    console.log("is ready : ", isReady);
    if (isReady) {
      setStartButtonBackground({ background: "#a0fab8" });
      socket.emit("start_game", {
        room: room,
        username: username,
        startGame: true,
      });
      setShowQuiz(true);
    } else {
      window.alert("opponent is not ready");
    }
  };

  const handleReadyGame = () => {
    setIsReady((prev) => !prev);
    if (isReady) {
      setStartButtonBackground({});
    } else {
      setStartButtonBackground({ background: "#a0fab8" });
    }
    socket.emit("user_ready", {
      room: room,
      username: username,
      isReady: !isReady,
    });
  };

  useEffect(() => {
    socket.on("user_joined", (data) => {
      //checking if the user is first user then check is he host or not
      if (data.activeUsers.length === 1) {
        setIsHost(data.user.isHost);
      }

      // if active users length is 2 then change the background color of the button
      if (data.activeUsers.length === 2) {
        setStartButtonBackground({});
      } else {
        setStartButtonBackground({ background: "#a0fab8" });
      }
      setActiveUsersList(data.activeUsers);
    });

    // Listen for user_left event
    socket.on("user_left", (data) => {
      if (data.activeUsers.length === 2) {
        setStartButtonBackground({});
      } else {
        setStartButtonBackground({ background: "#a0fab8" });
      }
      setActiveUsersList(data.activeUsers);
    });

    socket.on("user_ready", (data) => {
      setIsReady(data.isReady);
    });

    socket.on("start_game", (data) => {
      if (data.startGame) {
        setShowQuiz(true);
      }
    });

    return () => {
      // Cleanup event listeners
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("user_ready");
      socket.off("start_game");
    };
  }, [socket]);

  return (
    <>
      {!showQuiz && (
        <>
          <div className="active-users">
            <p>Room Id : {room.room}</p>
            <br />
            <p>Active Users:</p>
            <ul>
              {activeUsersList.map((user, index) => (
                <li key={index}>{user.username}</li>
              ))}
            </ul>
            {activeUsersList.length !== 2 && (
              <p>waiting for the opponent to join...</p>
            )}
          </div>
          <div className="joinChatContainer">
            {isHost ? (
              <button onClick={handleStartGame} style={startButtonBackground}>
                Start Game
              </button>
            ) : (
              <button onClick={handleReadyGame} style={startButtonBackground}>
                Ready
              </button>
            )}
          </div>
        </>
      )}
      {showQuiz && (
        <QuizBattle
          socket={socket}
          username={username}
          room={room}
          isHost={isHost}
        />
      )}
    </>
  );
};
