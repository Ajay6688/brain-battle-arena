import "../../styles/IQTest.css";
import "../../App.css";
import PatternGame from "./pattern_game";
import TextMCQ from "./textMCQ_game";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizBattle = ({ socket, username, room, isHost }) => {
  const [quesArr, setQuesArr] = useState([{}]);
  const [quesIndex, setQuesIndex] = useState(0);
  const [quesNumber, setQuesNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [userAns, setUserAns] = useState(null);
  const [timer, setTimer] = useState(30);
  const [endOfGame, setEndOfGame] = useState(false);
  const [user1Submitted, setUser1Submitted] = useState(false);
  const [user2Submitted, setUser2Submitted] = useState(false);
  const [isWinnerData, setIsWinnerData] = useState({});
  const [buttonBackground, setButtonBackground] = useState({});

  const navigate = useNavigate();

  const handleSubmitClick = () => {
    setUser1Submitted(true);
    socket.emit("submit_answer", {
      isAnswerSubmitted: true,
      username: username,
      room: room.room,
      isHost: isHost,
    });

    if (userAns === quesArr[quesIndex].ans) {
      console.log("correct");
      setScore((prev) => prev + 1);
    } else {
      console.log("wrong");
    }
    
    setButtonBackground({ background: "#a0fab8" });
  };

  // this will run only once so will initialize the
  useEffect(() => {
    socket.emit("send_questions", { room: room.room });
  }, []);

  useEffect(() => {
    if (user1Submitted && user2Submitted) {
      if (quesIndex < quesArr.length - 1) {
        setQuesIndex((prev) => prev + 1);
        setQuesNumber((prev) => prev + 1);
        setTimer(quesArr[quesIndex + 1].time); // reset timer
        setButtonBackground({});
      }
      setUser1Submitted(false);
      setUser2Submitted(false);
      if (quesIndex === quesArr.length - 1) {
        socket.emit("send_score", {
          score: score,
          username: username,
          room: room.room,
          isHost: isHost,
        });
        setEndOfGame(true);
        return;
      }
    }
  }, [user1Submitted, user2Submitted]);

  useEffect(() => {
    socket.on("submit_answer", (data) => {
      setUser2Submitted(data.isAnswerSubmitted);
    });

    socket.on("send_questions", (data) => {
      setQuesArr(data);
    });

    socket.on("send_score", (data) => {
      setIsWinnerData(data);
    });

    return () => {
      // cleanup socket event function
      socket.off("submit_answer");
      socket.off("send_questions");
      socket.off("send_score");
    };
  }, [socket]);

  useEffect(() => {
    let timerId;
    if (timer > 0) {
      timerId = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      handleSubmitClick(null); // Automatically submit the question when the timer reaches 0
    }
    return () => clearTimeout(timerId);
  }, [timer, quesIndex]);

  return (
    <>
      <div>
        <div className="mainGameTopicContainer">
          <div
            className="mainGameTopicChild"
            style={{
              fontSize: "46px",
              fontFamily: "'Bai Jamjuree', sans-serif",
              color: "#0490c7",
              display: "flex",
              justifyContent: "end",
              width: "535px",
              marginLeft: "259px",
            }}
          >
            Brain Battle Arena
          </div>
          <div className="mainGameTopicChild">
            {!endOfGame && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "23px",
                  color: "red",
                }}
              >
                Time Left : {timer}
              </div>
            )}
          </div>
        </div>
        {!endOfGame && (
          <>
            <div
              style={{
                fontFamily: "'Bai Jamjuree', sans-serif",
                color: "#0490c7",
                height: "0px",
                marginLeft: "12%",
              }}
            >
              <h2>
                Q {quesNumber}/{quesArr.length}
              </h2>
            </div>
            {quesArr[quesIndex].type === "PATTERN" ? (
              <PatternGame
                ques={quesArr[quesIndex]}
                setQuesIndex={setQuesIndex}
                setQuesNumber={setQuesNumber}
                setScore={setScore}
                handleSubmitClick={handleSubmitClick}
                setUserAns={setUserAns}
                option={null}
              />
            ) : (
              <TextMCQ
                handleSubmitClick={handleSubmitClick}
                setUserAns={setUserAns}
              />
            )}
          </>
        )}

        {endOfGame && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "3%",
            }}
          >
            <h2
              style={{
                fontFamily: "'Bai Jamjuree', sans-serif",
                color: "#0490c7",
              }}
            >
              Game is Completed!
            </h2>
            <h2
              style={{
                fontFamily: "'Bai Jamjuree', sans-serif",
                color: "#f20f0f",
                border: "1px solid black",
                padding: "9px",
              }}
            >
              {score > isWinnerData.score
                ? "You Won"
                : score === isWinnerData.score
                ? "It's a Tie"
                : "You Lost"}
            </h2>
            <h3
              style={{
                fontFamily: "'Bai Jamjuree', sans-serif",
                color: "#0490c7",
              }}
            >
              Your Score is : {score} / {quesArr.length} <br />
              Your Opponent score is : {isWinnerData.score} / {quesArr.length}
            </h3>
            <div
              style={{
                fontFamily: "'Bai Jamjuree', sans-serif",
                color: "#10749c",
                display: "flex",
                alignItems: "center",
              }}
            ></div>
            <button className="btn signup" onClick={() => navigate("/")}>
              Home
            </button>
          </div>
        )}

        <span
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          {!endOfGame && (
            // <div className="joinChatContainer">
            <div className="joinChatContainer">
              <button
                type="submit"
                onClick={handleSubmitClick}
                style={buttonBackground}
              >
                Submit
              </button>
              {user1Submitted && (
                <p>waiting for opponent to submit the answer</p>
              )}
            </div>
          )}
        </span>
      </div>
    </>
  );
};

export default QuizBattle;
