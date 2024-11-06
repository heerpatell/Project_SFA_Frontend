import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen7() {
  const { pnumber } = useParams();
  const { condition } = useParams();

  const navigate = useNavigate();
  const [showFC, setShowFc] = useState(false);
  const [showSC, setShowSC] = useState(false);
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);

  const clickedNext = () => {
    navigate(`/screen63/${pnumber}/${condition}`);
  };

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
    <>
      <div
        style={{
          minHeight:'100vh',
          padding:'2rem',
          backgroundColor: "aliceblue",
          color: "#1c1c1c",
          display: "flex",
          height:'100%',
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100rem",
            height: "max-content",
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem",
            fontSize: "2.3rem",
          }}
        >
          <div
            style={{
              color: "#1c1c1c",
              textAlign: "center",
              fontSize: "3rem",
            }}
          >
            <b>
              <u>CUSTOMER FEEDBACK</u>
            </b>
          </div>

          <div>
            {(showFC || showSC) && (
              <div>
                In each round, <b>after</b> the Worker you are paired with chooses their effort level, you will be informed of their chosen effort level. You will also be informed of your payoff in that round. 
              </div>
            )}
            {showPre && (
              <div>
                In each round, before the Worker you are paired with chooses their effort level, you will decide how much to tip the Worker. Then, you will be informed of the Worker’s chosen effort level. You will also be informed of your payoff in that round.
              </div>
            )}
            {showPost && (
              <div>
                In each round, after the Worker you are paired with chooses their effort level, you will be informed of their chosen effort level. Then, you will decide how much to tip the Worker. You will also be informed of your payoff in that round.
              </div>
            )}
          </div>
          <br/>
          <div>
          Please note that Workers will not be informed of your level of satisfaction with their service or your total payoff in each round.  
          </div>
          <br/>
          {
            showSC && (<div>
              However, Workers will be informed of the amount of the service charge you pay them.<br/>
            </div>)
          }
          {
            showPre && (<div>
              However, Workers will be informed of the amount of the tip you pay them.<br/>
            </div>)
          }
          {
            showPost && (<div>
              However, Workers will be informed of the amount of the tip you pay them.<br/>
            </div>)
          }
          
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
    </>
  );
}

export default Screen7;
