import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Screen27() {
  const navigate = useNavigate()
  let [participantReached, setParticipantReached] = useState(0)
  const {lastRoundCumulativeComp} = useParams()
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

  useEffect(()=>{
    setParticipantReached((prev)=>prev+1)
    console.log(25, participantReached)
    verifyUser()
  },[])
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
            height:'max-contnet',
            width: "100rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem",
            fontSize: "2.3rem",
          }}
        >
          <div
            style={{
              color: "#1c1c1c",
              fontSize: "2.3rem",
              textAlign: "center",
            }}
          >
        <div style={{fontSize:'2.3rem'}}><u><b>END OF STUDY</b></u></div>
            <br/>
            <div style={{color:'#1c1c1c'}}>Thank you very much for your participation today! </div>
            <br/>
            <div style={{color:'#1c1c1c'}}>You have earned a total of {lastRoundCumulativeComp} tokens in today’s study. Your tokens will be converted into actual cash at the rate of 100 tokens = $0.90 CND. </div>
            <br/>
            <div style={{color:'#1c1c1c'}}> <b>Therefore, you have earned total of : ${(lastRoundCumulativeComp * 0.009).toFixed(2)}</b></div>
            <br/>
            <div style={{color:'#1c1c1c'}}>Please be patient and remain seated until the experimenter announces the end of study.</div>
            <br/>
        </div>           
        </div>
      </div>
    </>
  );
}

export default Screen27;


