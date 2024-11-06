import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen63() {
  const { pnumber, condition } = useParams();

  const verifyUser = () => {
    axios
      .post(`${REACT_APP_BACKEND_URL}/generate/getlink`,{'token': localStorage.getItem('token')}, {
        withCredentials: true,
      })
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

  const navigate = useNavigate();

  const [showFC, setShowFc] = useState(false);
  const [showSC, setShowSC] = useState(false);
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);

  const clickedNext = () => {
    navigate(`/screen8/${pnumber}/${condition}`)
  }
  useEffect(() => {
    verifyUser()
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
  return (
    <div
      style={{
        minHeight:'100vh',
        padding:'2rem 0',
        backgroundColor: "aliceblue",
        color: "#1c1c1c",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height:'max-content',
          width: "80rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.4rem",
          fontSize: "2.3rem",
        }}
      >
        <div style={{ color: "#1c1c1c", textAlign: "center",fontSize: "3rem" }}>
            <u><b>WORKER FEEDBACK</b></u>
        </div>

        <div style={{
          display:'flex',
          flexDirection:'column',
          gap:'1.3rem'
        }}>    


<div style={{ color: "#1c1c1c", fontSize: "2.3rem"}}>
            <b>End of Round Feedback</b>
          </div>
          <br/>
          <div>At the end of each round, all customers will receive feedback about <b>their own payoffs</b> and <b>the individual components</b> that are added to the sum of their payoffs in that round, as well as their own cumulative payoffs up to that round.</div>
          <br/>
          <div>Similarly, at the end of each round, all workers will receive feedback about <b>their own compensation</b> and <b>the individual components</b> that are added to the sum of their compensation in that round, as well as their own cumulative compensation up to that round. </div>
          <br/>
          <div>Next, you will take a short quiz to test your comprehension of the instructions. </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  cursor: 'pointer',
                  margin: 'auto',
                  marginTop: '2rem',
                  width: '8rem',
                  borderRadius: '0.2rem',
                  height: '4rem',
                  fontSize: '2.3rem',
                  color: 'aliceblue',
                  backgroundColor: '#1c1c1c',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={clickedNext}
              >
                Next
              </div>
            </div>           
        </div>
      </div>
    </div>
  );
}

export default Screen63;
