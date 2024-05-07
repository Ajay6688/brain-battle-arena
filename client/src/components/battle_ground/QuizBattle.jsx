import "../../styles/IQTest.css";
import "../../styles/TextMCQ.css";
import "../../App.css";
import PatternGame from "./pattern_game";
import TextMCQ from "./textMCQ_game";
import { useEffect, useState } from "react";
import player1Img from "../../assets/images/player1img.png";
import player2Img from "../../assets/images/player2img.png";

const QuizBattle = ({
  socket,
  username,
  room,
  isHost,
  questionsCategory,
  categoryId,
}) => {
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
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);

  const handleSubmitClick = () => {
    setIsSubmitButtonClicked(true);
    console.log("is Submit Button Clicked " ,isSubmitButtonClicked);
    if (!isSubmitButtonClicked) {
      setUser1Submitted(true);
      socket.emit("submit_answer", {
        isAnswerSubmitted: true,
        username: username,
        room: room.room,
        isHost: isHost,
      });

      if (userAns === quesArr[quesIndex]?.ans) {
        console.log("correct");
        setScore((prev) => prev + 1);
      } else {
        console.log("wrong");
      }

      setButtonBackground({ background: "#a0fab8" });
    }
    return;
  };

  useEffect(()=>{
    setIsSubmitButtonClicked(false);
  } , [quesNumber])

  // this will run only once so will initialize the
  useEffect(() => {
    let category = null;
    if (categoryId !== null) {
      category = categoryId;
    } else {
      category = questionsCategory;
    }
    console.log("final category ", category);
    socket.emit("send_questions", { room: room.room, category: category });
  }, []);

  useEffect(() => {
    if (user1Submitted && user2Submitted) {
      if (quesIndex < quesArr?.length - 1) {
        setQuesIndex((prev) => prev + 1);
        setQuesNumber((prev) => prev + 1);
        setTimer(quesArr[quesIndex + 1]?.time); // reset timer
        setButtonBackground({});
      }
      setUser1Submitted(false);
      setUser2Submitted(false);
      if (quesIndex === quesArr?.length - 1) {
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
      <section class="section-3">
        <div class="sec-3-main">
          <img class="left-imgg" src={player1Img} alt="player 1 img" />
          <img class="right-imgg" src={player2Img} alt="player 2 img" />
          <div class="fiirst-nav">
            {!endOfGame && (
              <div class="ques">
                <span>
                  <strong>
                    {" "}
                    Q {quesNumber}/{quesArr?.length}{" "}
                  </strong>
                </span>
              </div>
            )}
            <div class="testt">
              {" "}
              <span>
                <strong>Brain Battle Arena</strong>{" "}
              </span>
            </div>
            {!endOfGame && (
              <div class="time">
                <span>
                  <strong>Time Left : {timer}</strong>
                </span>
              </div>
            )}
          </div>

          {!endOfGame && (
            <>
              {quesArr[quesIndex]?.type === "PATTERN" ? (
                <PatternGame
                  ques={quesArr[quesIndex]}
                  setQuesIndex={setQuesIndex}
                  setQuesNumber={setQuesNumber}
                  setScore={setScore}
                  handleSubmitClick={handleSubmitClick}
                  setUserAns={setUserAns}
                  quesNumber = {quesNumber}
                />
              ) : (
                <TextMCQ
                  handleSubmitClick={handleSubmitClick}
                  setUserAns={setUserAns}
                  ques={quesArr[quesIndex]}
                  setQuesIndex={setQuesIndex}
                  setQuesNumber={setQuesNumber}
                  quesNumber = {quesNumber}
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
                  color: "#56B945",
                }}
              >
                Game is Completed!
              </h2>
              <h2
                style={{
                  fontFamily: "'Bai Jamjuree', sans-serif",
                  color: "#56B945",
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
                  color: "#56B945",
                }}
              >
                Your Score is : {score} / {quesArr?.length} <br />
                Your Opponent score is : {isWinnerData.score} /{" "}
                {quesArr?.length}
              </h3>
              <div class="sbutton">
                <button
                  type="submit"
                  style={{ background: "#56B945" }}
                  // style={buttonBackground}
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Home
                </button>
              </div>
            </div>
          )}
          {!endOfGame && (
            <div class="sbutton">
              <button
                type="submit"
                onClick={handleSubmitClick}
                style={buttonBackground}
              >
                submit
              </button>
              {user1Submitted && (
                <p>waiting for opponent to submit the answer</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* <div>
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
                Q {quesNumber}/{quesArr?.length}
              </h2>
            </div>
            {quesArr[quesIndex]?.type === "PATTERN" ? (
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
              Your Score is : {score} / {quesArr?.length} <br />
              Your Opponent score is : {isWinnerData.score} / {quesArr?.length}
            </h3>
            <div
              style={{
                fontFamily: "'Bai Jamjuree', sans-serif",
                color: "#10749c",
                display: "flex",
                alignItems: "center",
              }}
            ></div>
            <button
              className="startButtonContainer"
              onClick={() => {
                window.location.reload();
              }}
            >
              Home
            </button>
          </div>
        )}

        <span
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            width: "100%",
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
      </div> */}
    </>
  );
};

export default QuizBattle;
