import React, { useEffect, useState } from "react";
import "../../styles/BattleGroundPage.css";
import QuizBattle from "./QuizBattle";
import player1image from "../../assets/images/player1img.png";
import player2image from "../../assets/images/player2img.png";

export const BattleGroundPage = ({
  socket,
  username,
  room,
  questionsCategory,
  categoryId,
}) => {
  const [activeUsersList, setActiveUsersList] = useState([]);
  const [startButtonBackground, setStartButtonBackground] = useState({});
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      console.log("inside if e")
      e.returnValue = 'you will have to recreate the room on reload'; // Legacy method for cross browser support
    }
    return 'you will have to recreate the room on reload'; // Legacy method for cross browser support
  };

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

  // console.log(activeUsersList[0].username);

  return (
    <>
      {!showQuiz && (
        <>
          <section className="player-name">
            <div className="in-game-name">
              <div className="navbarrr">
                <h3>{/* Q 3/3 */}</h3>
                <h1>Room ID: {room.room}</h1>
                <h4>{/* Time :00 */}</h4>
              </div>
              <div className="main-section">
                <div className="left-side-player">
                  <h1>{username}</h1>
                  <img src={player1image} alt="player 1 img" />
                </div>
                <div className="ssspan">
                  <span>
                    {activeUsersList.length !== 2 && (
                      <p>waiting for the opponent to join...</p>
                    )}
                  </span>
                </div>

                <div className="right-side-player">
                  {activeUsersList.length === 2 && (
                    <>
                      <h1>{activeUsersList[1].username}</h1>
                      <img src={player2image} alt="player 2 img" />
                    </>
                  )}
                </div>
              </div>
              <div className="startButtonContainer">
                {isHost ? (
                  <button
                    onClick={handleStartGame}
                    style={startButtonBackground}
                  >
                    Start Game
                  </button>
                ) : (
                  <button
                    onClick={handleReadyGame}
                    style={startButtonBackground}
                  >
                    Ready
                  </button>
                )}
              </div>
            </div>
          </section>
        </>
      )}
      {showQuiz && (
        <QuizBattle
          socket={socket}
          username={username}
          room={room}
          isHost={isHost}
          questionsCategory={questionsCategory}
          categoryId={categoryId}
        />
      )}
    </>
  );
};
