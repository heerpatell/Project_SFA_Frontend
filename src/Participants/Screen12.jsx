import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import io from "socket.io-client";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io(`${REACT_APP_BACKEND_URL}`, {
  transports: ['websocket', 'polling'], // Use default transports
});

function Screen12() {
  let {pnumber,condition,currentround} = useParams()
  const navigate = useNavigate()
  if(currentround == 0){
    currentround = 'Practice Round'
  }
const clickedNext = () => {
  navigate(`/screen13/${pnumber}/${condition}/${currentround}`)
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

useEffect(()=>{
  verifyUser()
},[])
  return (
    <>
    <div style={{
          height: "100vh",
          backgroundColor: "aliceblue",
          color: "#1c1c1c",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <div
          style={{
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
              fontSize: "3rem",
              textAlign: "center",
            }}
          >

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
          <div style={{
            fontSize:'2.3rem',
            display:'flex',
            flexDirection:'column',
            gap:'1rem',
            paddingTop:'2rem'
          }}>
          <div>As a Customer, recall, your payoff in this round is calculated as follows: </div>
            <div style={{color:'#1c1c1c'}}>Payoff = 60 + Satisfaction from Worker's service - Tip paid to the Worker</div>
            <div>where,</div>
            <div style={{color:'#1c1c1c'}}>Satisfaction from Worker's Service = Worker Effort Level * 200</div>
            <div>In each round, your payoff is determined by your level of satisfaction with the Worker’s service minus the tip paid to the Worker. Your level of satisfaction with the Worker’s service is determined by the Worker’s effort level. That is, the higher the effort level the Worker chooses to serve you, the higher your level of satisfaction with the Worker’s service. 
            </div>
            <div>Please note that you will decide how much to tip the Worker in each round. The amount of tip can range from zero up to 80 tokens. That is, you can tip nothing, can tip a maximum of 80 tokens, or can tip anywhere in between. Importantly, you tip the Worker before he/she serves you. 
            </div>
          </div>

          <div style={{             
            fontSize:'2.3rem',
            display:'flex',
            flexDirection:'column',
            gap:'1rem' }}>
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
  )
}

export default Screen12
