import "../../../styles/IQTest.css";
import { useEffect, useState } from "react";

const PatternGame = (props) => {

    const [loadingError, setLoadingError] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const getBorderColor = (option) => {
        return selectedOption === option ? { border: "1px solid #238511" } : {};
    };

    useEffect(()=>{
        setSelectedOption(null);
      } , [props.quesNumber]);

    return <>
        <div className="outer-iq-game">
            <div className="outer-iq-test-box">
                {!loadingError ? <img src={props.ques.q} alt="question img" style={{ width: "100%", height: "100%" }} onError={() => {
                    console.error("Image failed to load");
                    setLoadingError(true);
                }} /> : <span>loading...</span>}
            </div>
            <div className="outer-iq-options-box">
                <div className="options-row">
                    <div className="iq-options-box" style={getBorderColor("A")} onClick={()=>{
                        handleOptionClick("A");
                        props.setUserAns("A");
                    }}
                        >
                        <div style={{ marginLeft: "7px" }}>A</div>
                        {!loadingError ? <img src={props.ques.A} alt="" style={{ height: "80%", width: "100%" }} onError={() => setLoadingError(true)} /> : <span>loading...</span>}
                    </div>
                    <div className="iq-options-box" style={getBorderColor("B")} onClick={()=>{
                        handleOptionClick("B");
                        props.setUserAns("B");
                        }}>
                        <div style={{ marginLeft: "7px" }}>B</div>
                        {!loadingError ? <img src={props.ques.B} alt="" style={{ height: "80%", width: "100%" }} onError={() => setLoadingError(true)} /> : <span>loading...</span>}
                    </div>
                </div>
                <div className="options-row">
                    <div className="iq-options-box" style={getBorderColor("C")} onClick={()=>{
                        handleOptionClick("C");
                        props.setUserAns("C");
                        }}>
                        <div style={{ marginLeft: "7px" }}>C</div>
                        {!loadingError ? <img src={props.ques.C} alt="" style={{ height: "80%", width: "100%" }} onError={() => setLoadingError(true)} /> : <span>loading...</span>}
                    </div>
                    <div className="iq-options-box" style={getBorderColor("D")} onClick={()=>{
                        handleOptionClick("D");
                        props.setUserAns("D");
                        }}>
                        <div style={{ marginLeft: "7px" }}>D</div>
                        {!loadingError ? <img src={props.ques.D} alt="" style={{ height: "80%", width: "100%" }} onError={() => setLoadingError(true)} /> : <span>loading...</span>}
                    </div>
                </div>
            </div>
        </div>
    </>
}


export default PatternGame;