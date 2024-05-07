import { useEffect, useState } from "react";
import "../../../styles/TextMCQ.css";

const TextMCQ = (props) => {

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    props.setUserAns(option);
  };

  useEffect(()=>{
    setSelectedOption(null);
  } , [props.quesNumber]);

  return (
    <>
       <div class="your-name">
            <div>
                <h1>{props.ques.q} </h1>
            </div>
        </div>
        <div class="first-names">
            <h1 onClick={()=>handleOptionClick("A")}  style={selectedOption === "A" ? {background : "#238511"} : {}}>A : {props.ques.A}</h1>
            <h1 onClick={()=>handleOptionClick("B")}  style={selectedOption === "B" ? {background : "#238511"} : {}}>B : {props.ques.B}</h1>
        </div>
        <div class="last-names">
            <h1 onClick={()=>handleOptionClick("C")} style={selectedOption === "C" ? {background : "#238511"} : {}}>C : {props.ques.C}</h1>
            <h1 onClick={()=>handleOptionClick("D")} style={selectedOption === "D" ? {background : "#238511"} : {}}>D : {props.ques.D}</h1>
        </div>
    </>
  );
};

export default TextMCQ;
