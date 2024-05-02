import { Link } from "react-router-dom";

export const QuestionsCategory = () => {

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "468px",
            marginTop: "130px",
          }}
        >
          <Link to={"/0"}>
            <div
              style={{
                width: "100px",
                height: "100px",
                background: "#f5ffad",
                display: "flex",
                alignItems: "center",
              }}
            >
              DSA
            </div>
          </Link>
          <Link to={"/1"}>
            <div
              style={{
                width: "100px",
                height: "100px",
                background: "#adfcff",
                display: "flex",
                alignItems: "center",
              }}
            >
              Aptitude
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
