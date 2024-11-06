import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io(`${REACT_APP_BACKEND_URL}`, {
  transports: ["websocket", "polling"], // Use default transports
});

function Screen14() {
  let { pnumber, condition, currentround } = useParams();
  const [effortlevel, setEffortlevel] = useState();
  const [showFC, setShowFc] = useState(false);
  const [showSC, setShowSC] = useState(false);
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [tip, setTip] = useState(0);
  const [error, setError] = useState("");
  if (currentround == 0) {
    currentround = "Practice Round";
  }
  const navigate = useNavigate();

  const handleScrollChange = (e) => {
    const value = e.target.value;
    setEffortlevel(value);
    
    const regex = /^(0(\.\d+)?|\.?\d+(\.\d+)?|1(\.0+)?)$/;

    const floatValue = parseFloat(value);

    // Check if the input is empty or does not match the regex or is out of bounds
    if (
        value === "" || 
        !regex.test(value) || 
        floatValue <= 0 || 
        floatValue > 1 ||
        (floatValue % 0.1 !== 0 && floatValue * 10 % 1 !== 0) // Check increments of 0.1
    ) {
        setError("Please enter a number between 0.1 and 1.0 in 0.1 increments."); 
    } else {
        setError(""); // Clear error if input is valid
    }


  };

  const verifyUser = () => {
    axios
      .post(
        `${REACT_APP_BACKEND_URL}/generate/getlink`,
        { token: localStorage.getItem("token") },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(21, res.data);
        if (res.data.msg === "access denied") {
          navigate("/notfound");
        }
      })
      .catch((e) => {
        navigate("/notfound");
      });
  };

  const getTip = async () => {
    await axios
      .post(
        `${REACT_APP_BACKEND_URL}/generate/geteffortlevelworker`,
        { pnumber, currentround, token: localStorage.getItem("token") },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setTip(res.data.pretip);
      });
  };
  useEffect(() => {
    verifyUser();
    getTip();
    if (condition === "Fixed Condition") {
      setShowFc(true);
    }
    if (condition === "Service Charge") {
      setShowSC(true);
    }
    if (condition === "Pre-Tip") {
      setShowPre(true);
    }
    if (condition === "Post-Tip") {
      setShowPost(true);
    }
  }, []);

  const apicall = async () => {
    console.log(98, "here");
    try {
      const x = await axios.post(
        `${REACT_APP_BACKEND_URL}/generate/addeffortlevel`,
        {
          pnumber,
          currentround,
          effortlevel,
          condition,
          token: localStorage.getItem("token"),
        },
        {
          withCredentials: true,
        }
      );
      console.log(82, x.data);
    } catch (e) {
      console.log("error ", e);
    }
  };
  const clickedNext = async () => {
    try {
      await apicall();

      if (condition == "Pre-Tip") {
        navigate(`/waiting/${pnumber}/${condition}/${currentround}`);
        const categoryRes = await axios.post(
          `${REACT_APP_BACKEND_URL}/generate/getassignedcategory`,
          { pnumber, token: localStorage.getItem("token") },
          { withCredentials: true }
        );
        if (categoryRes.data.assignedCategory === "Worker") {
          try {
            await axios
              .post(
                `${REACT_APP_BACKEND_URL}/generate/matchpnumber`,
                { pnumber, currentround, token: localStorage.getItem("token") },
                { withCredentials: true }
              )
              .then((res) => {
                console.log(120, res);
                navigate(`/screen17/${pnumber}/${condition}/${currentround}`);
                socket.emit("nextto18", {
                  participant: res.data.participant,
                });
              });
          } catch (res) {
            console.error(
              "Error in matchpnumber API call:",
              res.response ? res.response.data : res.message
            );
          }
        }
      }
      if (condition == "Post-Tip") {
        navigate(`/waiting/${pnumber}/${condition}/${currentround}`);

        try {
          await axios
            .post(
              `${REACT_APP_BACKEND_URL}/generate/matchpnumber`,
              { pnumber, currentround, token: localStorage.getItem("token") },
              { withCredentials: true }
            )
            .then((res) => {
              console.log(120, res);
              navigate(`/waiting/${pnumber}/${condition}/${currentround}`);
              socket.emit("nextto15post", {
                currentScreen: "screen14",
                currentPnumber: pnumber,
                participant: res.data.participant,
              });
            });
        } catch (res) {
          console.error(
            "Error in matchpnumber API call:",
            res.response ? res.response.data : res.message
          );
        }
      }
      if (condition == "Service Charge" || condition == "Fixed Condition") {
        try {
          await axios
            .post(
              `${REACT_APP_BACKEND_URL}/generate/matchpnumber`,
              { pnumber, currentround, token: localStorage.getItem("token") },
              { withCredentials: true }
            )
            .then((res) => {
              console.log(120, res);
              navigate(`/screen17/${pnumber}/${condition}/${currentround}`);
              socket.emit("nextto15normal", {
                currentScreen: "screen14",
                participant: res.data.participant,
              });
            });
        } catch (res) {
          console.error(
            "Error in matchpnumber API call:",
            res.response ? res.response.data : res.message
          );
        }
      }
      console.log(104, "emitted");
    } catch (error) {
      console.error("Error in API call:", error);
    }
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "aliceblue",
          color: "#1c1c1c",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100rem",
            display: "flex",
            height:'max-content',
            flexDirection: "column",
            gap: "1.4rem",
            fontSize: "2.3rem",
          }}
        >
          <div
            style={{
              color: "#1c1c1c",
              fontSize: "3rem",
              textAlign: "center",
            }}
          >
            <u style={{ textTransform: "uppercase" }}>
            {
              (currentround == 'Practice Round') && (
                <u style={{textTransform:'uppercase'}}><b>WORKER EFFORT CHOICE &nbsp;|&nbsp; {currentround}</b></u>
              )
              (currentround != 'Practice Round') && (
                <u style={{textTransform:'uppercase'}}><b>WORKER EFFORT CHOICE &nbsp;|&nbsp; ROUND {currentround}</b></u>
              )
            }
            </u>
            <div
              style={{
                fontSize: "2.3rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                paddingTop: "2rem",
                color: "#1c1c1c",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: "2.3rem",
                  fontWeight: "800",
                  color: "#1c1c1c",
                }}
              >
                {" "}
                Your Task
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.4rem",
                }}
              >
                <div>
                  Possible effort levels and their associated costs are shown in{" "}
                  the table below.{" "}
                </div>
                <div>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "center",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          border: "1px solid #1c1c1c",
                          padding: "1rem",
                        }}
                      >
                        <th>Effort Level</th>
                        <th>0.1</th>
                        <th>0.2</th>
                        <th>0.3</th>
                        <th>0.4</th>
                        <th>0.5</th>
                        <th>0.6</th>
                        <th>0.7</th>
                        <th>0.8</th>
                        <th>0.9</th>
                        <th>1.0</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        style={{
                          border: "1px solid #1c1c1c",
                          padding: "1rem",
                        }}
                      >
                        <td>Cost (Tokens)</td>
                        <td>0</td>
                        <td>
                          5
                        </td>
                        <td>10</td>
                        <td>20</td>
                        <td>30</td>
                        <td>40</td>
                        <td>50</td>
                        <td>60</td>
                        <td>75</td>
                        <td>90</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  Importantly,{" "}
                  <b>
                    Customers’ level of satisfaction with your service increases{" "}
                    with your effort level.
                  </b>{" "}
                  The higher the effort level you choose, the <b>higher</b> the{" "}
                  Customers’ level of satisfaction. At the end of this study,{" "}
                  Customers’ satisfaction will determine their compensation. The{" "}
                  higher the Customers’ satisfaction, the higher the{" "}
                  compensation they will receive.
                </div>
              </div>
              <div
                style={{
                  fontSize: "2.3rem",
                  fontWeight: "800",
                  color: "#1c1c1c",
                }}
              >
                <b>Compensation</b>
              </div>
              <div>
                As a Worker, recall, your compensation in this round is calculated{" "}
                as follows:
              </div>
              {showFC && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    Compensation = Wage Paid by the Restaurant – Cost of Effort{" "}
                    Level
                  </div>
                  <div>
                    In each round, you will be paid{" "}
                    <b>a fixed wage of 200 tokens</b> by the restaurant. Please{" "}
                    note that this fixed wage is <b>higher</b> than the standard{" "}
                    wage at similar restaurants. As a result, Customers will{" "}
                    <b>
                      not
                    </b>{" "}
                    pay you additional compensation for serving them.
                  </div>
                  {/*                   <div>
                    Suppose you choose an effort level of 0.6. The compensation for you in this round will be 200 – 40 = 160 tokens.
                  </div> */}
                </div>
              )}
              {showSC && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    Compensation = Wage Paid by the Restaurant + Service Charge
                    – Cost of Effort Level
                  </div>
                  <div>
                    In each round, you will be paid{" "}
                    <b>a fixed wage of 160 tokens</b> by the restaurant. Please note that this fixed wage is the <b>standard</b> wage paid at similar restaurants. In addition, Customers pay you a <b>service charge</b> of{" "} <b>40 tokens</b> for serving them, which you receive as additional compensation.{" "}
                  </div>
                  <div>
                    Please note that Customers will pay you a <b>fixed</b>{" "}
                    amount of 40 tokens in each round, regardless of how you{" "}
                    serve them.
                  </div>
                  {/*                   <div>
                    For example, suppose you choose an effort level of 0.6. The
                    compensation for you in this round will be 160 + 40 – 40 =
                    160 tokens.{" "}
                  </div> */}
                </div>
              )}
              {showPre && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    Compensation = Wage Paid by the Restaurant + Customer Tip –
                    Cost of Effort Level
                  </div>
                  <div>
                    In each round, you will be paid{" "}
                    <b>a fixed wage of 160 tokens</b>
                    by the restaurant. Please note that this fixed wage is the{" "}
                    <b>standard</b> wage paid at similar restaurants. In{" "}
                    addition, Customers pay you <b>tips</b> for serving them,{" "}
                    which you receive as additional compensation.{" "}
                  </div>
                  <div>
                    Please note that Customers will decide how much to tip you{" "}
                    in each round. The amount of tip can range from{" "}
                    <b>zero up to 80 tokens.</b> That is, Customers can tip{" "}
                    nothing, can tip a maximum of 80 tokens, or can tip anywhere{" "}
                    in between. Importantly, Customers tip you <b>before</b> you{" "}
                    serve them.{" "}
                  </div>
                </div>
              )}
              {showPost && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    Compensation = Wage Paid by the Restaurant + Customer Tip –
                    Cost of Effort Level
                  </div>
                  <div>
                    In each round, you will be paid{" "}
                    <b>a fixed wage of 160 tokens</b>{" "}
                    by the restaurant. Please note that this fixed wage is the{" "}
                    <b>standard</b> wage paid at similar restaurants. In{" "}
                    addition, Customers pay you <b>tips</b> for serving them,{" "}
                    which you receive as additional compensation.{" "}
                  </div>
                  <div>
                    In each round, you will be paid a fixed wage of 160 tokens{" "}
                    by the restaurant. Please note that this fixed wage is the{" "}
                    standard wage paid at similar restaurants. In addition,{" "}
                    Customers pay you tips for serving them, which you receive{" "}
                    as additional compensation. Please note that Customers will{" "}
                    decide how much to tip you in each round. The amount of tip{" "}
                    can range from <b>zero up to 80 tokens.</b> That is,{" "}
                    Customers can tip nothing, can tip a maximum of 80 tokens,{" "}
                    or can tip anywhere in between. Importantly, Customers tip{" "}
                    you <b>after</b> you serve them.
                  </div>
                  {/*                   <div>
                    For example, suppose you choose an effort level of 0.6, and
                    then the Customer you are paired with decides to tip X
                    tokens. The compensation for you in this round will be 160 +
                    X – 40 tokens.
                  </div> */}
                </div>
              )}
              {showPre && (
                <div>
                  <div
                    style={{
                      fontSize: "2.3rem",
                      fontWeight: "800",
                      color: "#1c1c1c",
                    }}
                  >
                    Customer Tip
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      In this round, the Customer that you are paired with has{" "}
                      chosen to tip you: <div style={{fontSize:'2.3rem'}}><b>{tip}</b></div>
                    </div>
                    <div>Tip Paid to the Worker: {tip}</div>
                  </div>
                </div>
              )}
              <div>
                <div
                  style={{
                    fontSize: "2.3rem",
                    fontWeight: "800",
                    color: "#1c1c1c",
                    paddingBottom: "1rem",
                  }}
                >
                  <b>Choice of Effort Level</b>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.2rem",
                  }}
                >
                  <div>
                    As a Worker, you can choose an effort level between 0.1 and{" "}
                    1.0 (inclusive).{" "}
                  </div>
                  <div>Please make your choice: </div>
                  <div style={{ color: "#1c1c1c" }}>
                    <b>
                      How much effort level do you choose to serve the customer?
                    </b>
                  </div>
                  <div>
                    <input
                      style={{
                        width: "7rem",
                        border: "none",
                        outline: "none",
                        backgroundColor: "transparent",
                        padding: "0.5rem",
                        fontSize: "2.3rem",
                        color: "#1c1c1c",
                        borderBottom: "1px solid #1c1c1c",
                      }}
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={effortlevel}
                      onChange={handleScrollChange}
                    />
                    {error && (
                      <div style={{ color: "red", marginTop: "0.5rem" }}>
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: "2.3rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                Please click ‘Next’ to continue.
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    cursor: effortlevel ? "pointer" : "not-allowed",
                    opacity: effortlevel ? 1 : 0.5,
                    margin: "auto",
                    marginTop: "2rem",
                    width: "8rem",
                    borderRadius: "0.2rem",
                    height: "4rem",
                    fontSize: "2.3rem",
                    color: "aliceblue",
                    backgroundColor: "#1c1c1c",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    if (effortlevel) {
                      clickedNext(); 
                    }
                  }}
                >
                  Next
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Screen14;
