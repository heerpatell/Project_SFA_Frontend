import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import io from 'socket.io-client';
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io(`${REACT_APP_BACKEND_URL}`, {
  transports: ['websocket', 'polling'], // Use default transports
});

function Screen16() {
  const navigate = useNavigate()
  let { pnumber, condition,currentround } = useParams();
  const [showFC, setShowFc] = useState(false);
  const [showSC, setShowSC] = useState(false);
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [effortLevel, setEffortLevel] = useState(0)
  const [error, setError] = useState('');

  const [tip,setTip] = useState()
  if(currentround == 0){
    currentround = 'Practice Round'
  }
  const handleInp = (e) => {
    const value = e.target.value;
    // Check if the input is a valid number
    if (/^\d*$/.test(value)) {
      if (value === '' || (Number(value) >= 0 && Number(value) <= 80)) {
        setTip(value);
        setError(''); // Clear error if the input is valid
      } else {
        setError('Tip must be between 0 and 80.'); // Set error message
      }
    } else {
      setError('Please enter a valid number.'); // Set error for invalid input
    }
  }
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

  const getEffortLevel = async() => {
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/geteffortlevel`,{pnumber, currentround, 'token': localStorage.getItem('token')},{
      withCredentials:true
    })
    .then((res)=>{
      console.log(47, res.data)
      setEffortLevel(res.data.effort)
    })
    .catch((e)=>{
      console.log("error : ",e)
    })
  }
  useEffect(() => {
    verifyUser()
    getEffortLevel()
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
    console.log(84, condition)
    try{
      const x = await axios.post(`${REACT_APP_BACKEND_URL}/generate/addworkertip`,{pnumber, currentround, tip, 'token': localStorage.getItem('token')},{
        withCredentials:true
      })
      console.log(26,x.data)
    }catch(e){
      console.log('error ',e)
    }
  }
  const clickedNext = async () => {

    await apicall()
    
    await axios
            .post(
              `${REACT_APP_BACKEND_URL}/generate/matchpnumberforcustomer`,
              { pnumber, currentround,'token': localStorage.getItem('token') },
              { withCredentials: true }
            )
            .then((res) => {
              console.log(120, res);              
              navigate(`/screen18/${pnumber}/${condition}/${currentround}`)
              socket.emit("nextto17", {
                participant: res.data.participant,
              });
            });

  };

  const finalMessageStyle = {
    color: "#FFD700",
    fontSize: "2.3rem",
    marginTop: "1.5rem",
    textAlign: "center",
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
            height:'max-content',
            width: "100rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem",
            fontSize: "2.3rem",
          }}
        >
          <div
            style={{
              color: "aliceblue",
              fontSize: "2.3rem",
              textAlign: "center",
            }}
          >
            <div style={{color:'#1c1c1c', textTransform:'uppercase', fontSize:'3rem'}}>
            <u style={{ textTransform: "uppercase" }}>
            {
      currentround === 'Practice Round' ? (
        <b>CUSTOMER PAYOFF &nbsp;|&nbsp; {currentround}</b>
      ) : (
        <b>CUSTOMER PAYOFF &nbsp;|&nbsp; ROUND {currentround}</b>
      )
    }
            </u>
            </div>
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
              <div>
                As a Customer, you now need to decide how much to tip the Worker.
              </div>
              <div>
                You need to decide how much to tip the Worker for their service
                after they has chosen an effort level to serve you. The amount
                of tip can range from zero up to 80 tokens (rounded to the
                nearest whole number). The Worker will be informed of the tip
                you pay after they has made their choice of effort level.
              </div>
              <div
                  style={{
                    fontSize: "2.3rem",
                    fontWeight: "800",
                    color: "#1C1c1c",
                    padding: "1rem 0",
                  }}
                >
                  <b>Worker Effort Level</b>
                </div>
                <div>
                  In this round, the Worker that you are paired with has chosen
                  the effort level:
                </div>
                <div>
                  Worker Effort Level:{" "}
                  <span style={{ color: "#1c1c1c" }}>{effortLevel}</span>
                </div>

                <div
                style={{
                  fontSize: "2.3rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                  <div style={{ color: "#1c1c1c" }}>
                    How much do you want to tip the Worker for their service?
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
                      type="text"
                      placeholder="Enter Tip"
                      name="tip"
                      value={tip}
                      onChange={handleInp}
                    />
                    {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>} 
                  </div>
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
                    cursor: tip?'pointer':'not-allowed',
                    opacity:tip?1:0.5,
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
                  onClick={() => {
                    if (tip) {
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

export default Screen16;
