import "../../..//styles/IQTest.css"

const TextMCQ = (props) => {

    return <div className="outer-iq-game" style={{ flexDirection: "column", alignItems: "center", height: "63vh" }}>
        <h2 className="mcq-options-row" style={{ width: "76%", padding: "16px" }}>wha is your name :  </h2>
        <div className="row">
            <div
                className="col mcq-options-row"
                style={{ fontSize: "18px", fontWeight: "500" }}
                onClick={props.setUserAns.bind(null, "A")}
            >Ajay</div>
            <div className="col mcq-options-row"
                style={{ fontSize: "18px", fontWeight: "500" }}
                onClick={props.setUserAns.bind(null, "B")}
            >Abhishek</div>
            <div className="w-100"></div>
            <div className="col mcq-options-row"
                style={{ fontSize: "18px", fontWeight: "500" }}
                onClick={props.setUserAns.bind(null, "C")}
            >Hritik</div>
            <div className="col mcq-options-row"
                style={{ fontSize: "18px", fontWeight: "500" }}
                onClick={props.setUserAns.bind(null, "D")}
            >Siva sai</div>
        </div>
    </div>
}


export default TextMCQ;