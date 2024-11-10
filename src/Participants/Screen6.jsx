import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen6() {
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
    navigate(`/screen62/${pnumber}/${condition}`)
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
          width: "100rem",
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
          {showFC && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>In each round, <b>after</b> you choose your effort level, you will be informed of your compensation in that round. </div>
            </div>
          )}
          {showSC && <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
          >
              <div>In each round, after you choose your effort level, you will be informed of your compensation in that round. </div>
            </div>}
            {
              showPre && <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.6rem",
              }}
              >
                <div>In each round, before you choose your effort level, you will be informed of how much the Customer you are paired with has chosen to tip you. Then, after you make your choice of effort level, you will be informed of your compensation in that round.</div>
              </div>
            }
            {
              showPost && <div>
                  <div>In each round, after you choose your effort level, you will be informed of how much the Customer you are paired with has chosen to tip you. You will also be informed of your compensation in that round.</div>
                </div>
            }
            <br/>
            <div>Please note that Customers will be informed of your chosen effort levels in each round. However, Customers will not know the cost associated with your effort levels, how much you are paid by the restaurant, or your total compensation. In other words, Customers will <b>only</b> know how much effort you choose to serve them. </div>
             <br/>
             <div>Please click ‘Next’ to continue.</div>
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

export default Screen6;
