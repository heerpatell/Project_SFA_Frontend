import React,{useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen5() {
const {pnumber} = useParams()
const {condition} = useParams()
const navigate = useNavigate()

const [showFC, setShowFc] = useState(false)
const [showSC, setShowSC] = useState(false)
const [showPre, setShowPre] = useState(false)
const [showPost, setShowPost] = useState(false)

  const verifyUser = () => {
    axios
      .post( `${REACT_APP_BACKEND_URL}/generate/getlink`,{'token': localStorage.getItem('token')}, {
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
    if(condition === 'Fixed Condition'){
      setShowFc(true)
    }
    if(condition === 'Service Charge'){
        setShowSC(true)
    }
    if(condition === 'Pre-Tip'){
        setShowPre(true)
    }
    if(condition === 'Post-Tip'){
        setShowPost(true)
    }
  },[])

  const clickedNext = () => {
    navigate(`/screen7/${pnumber}/${condition}`) 
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "aliceblue",
          padding:'3.5rem',
          minHeight:'100vh',
          color: "#1c1c1c",
          display: "flex",
            flexDirection: "column",
            justifyContent:'center',
            alignItems:'center',
        }}
      >
        <div
          style={{
            width:'100rem',
            height:'max-contnet',
            display: "flex",
            flexDirection: "column",
            gap:'1.4rem'
          }}
        >
            <div style={{
              color: "#1c1c1c",
              textAlign:'center',
              textAlign:"center",
              fontSize:'3rem'
            }}><u><b>CUSTOMER PAYOFF</b></u></div>
            <div style={{
              fontSize:'2.3rem'
            }}>
              <div style={{color:'#1c1c1c', fontSize:'2.3rem', paddingBottom:'1rem'}}><b>Payoff</b></div>
              <div>As a Customer, your payoff in each round is calculated as follows:</div>
            </div>
            
            <div style={{
              fontSize:'2.3rem',
              display:'flex',
              flexDirection:'column',
              gap:'1.3rem'
            }}>
                {
                    showFC && (
                        <div style={{
                          fontSize:'2.3rem',
                          display:'flex',
                          flexDirection:'column',
                          gap:'1rem'
                        }}>
                            <div style={{textAlign:'center'}}>Payoff = 60 + Satisfaction from Worker’s Service</div>
                            <div style={{textAlign:'center'}}>where, Satisfaction from Worker’s Service = Worker Effort Level * 200</div>
                            <br/>
                            <div>In each round, your payoff is determined by your level of satisfaction with the Worker’s service, which is determined by the Worker’s effort level. That is, the higher the effort level the Worker chooses to serve you, the higher your level of satisfaction with the Worker’s service. </div>
                            <br/>
                            <div>The worker’s effort level can range from 0.1 to 1. That is, the Worker can provide a minimum effort level of 0.1, a maximum effort level of 1, or anywhere in between.</div>
                            <br/>
                            <div>For example, suppose the Worker you are paired with chooses an effort level of 0.6. The payoff for you in this round will be 60 + 0.6*200 = 180 tokens. </div>
                        </div>
                    )
                }
                {
                    showSC && (
                        <div style={{
                          fontSize:'2.3rem',
                          display:'flex',
                          flexDirection:'column',
                          gap:'1rem'
                        }}>
                            <div style={{textAlign:'center'}}>Payoff = 60 + Satisfaction from Worker’s Service – Service Charge Paid to the Worker</div>
                            <div style={{textAlign:'center'}}>where, Satisfaction from Worker’s Service = Worker Effort Level * 200, </div>
                            <div style={{textAlign:'center'}}>Service Charge Paid to the Worker = 40</div>
                            <br/>
                            <div>In each round, your payoff is determined by your level of satisfaction with the Worker’s service minus the <b>service charge</b> paid to the Worker. Your level of satisfaction with the Worker’s service is determined by the Worker’s effort level. That is, the higher the effort level the Worker chooses to serve you, the higher your level of satisfaction with the Worker’s service. </div>
                            <br/>
                            <div>The worker’s effort level can range from 1 to 10. That is, the Worker can provide a minimum effort level of 1, a maximum effort level of 10, or anywhere in between.</div>
                            <br/>
                            <div>Please note that you will pay a <b>fixed</b> amount of <b>service charge</b> of 40 tokens to the Worker in each round, regardless of how the Worker serves you.</div>
                            <br/>
                            <div>For example, suppose the Worker you are paired with chooses an effort level of 0.6. The payoff for you in this round will be 60 + 0.6*200 – 40 = 140 tokens. </div>
                        </div>
                    )
                }
                {
                    showPre && (
                        <div style={{
                          fontSize:'2.3rem',
                          display:'flex',
                          flexDirection:'column',
                          gap:'1rem'
                        }}>
                            <div style={{textAlign:'center'}}>Payoff = 60 + Satisfaction from Worker’s Service – Tip Paid to the Worker</div>
                            <div style={{textAlign:'center'}}>where, Satisfaction from Worker’s Service = Worker Effort Level * 200</div>
                            <br/>
                            <div>In each round, your payoff is determined by your level of satisfaction with the Worker’s service minus the <b>tip</b> paid to the Worker. Your level of satisfaction with the Worker’s service is determined by the Worker’s effort level. That is, the higher the effort level the Worker chooses to serve you, the higher your level of satisfaction with the Worker’s service. </div>
                            <br/>
                            <div>The worker’s effort level can range from 1 to 10. That is, the Worker can provide a minimum effort level of 1, a maximum effort level of 10, or anywhere in between.</div>
                            <br/>
                            <div>Please note that you will decide how much to tip the Worker in each round. The amount of tip can range from <b>zero up to 80 tokens.</b> That is, you can tip nothing, can tip a maximum of 80 tokens, or can tip anywhere in between. Importantly, you tip the Worker <b>before</b> he/she serves you. </div>
                            <br/>
                            <div>For example, suppose you decide to tip 40 tokens, and then the Worker you are paired with chooses an effort level of 0.6. The payoff for you in this round will be 60 + 0.6*200 – 40 = 140 tokens. </div>                        
                        </div>
                    )
                }
                {
                    showPost && (
                        <div style={{
                          fontSize:'2.3rem',
                          display:'flex',
                          flexDirection:'column',
                          gap:'1rem'
                        }}>
                            <div style={{textAlign:'center'}}>Payoff = 60 + Satisfaction from Worker’s Service – Tip Paid to the Worker</div>
                            <div style={{textAlign:'center'}}>where, Satisfaction from Worker’s Service = Worker Effort Level * 200</div>
                            <br/>
                            <div>In each round, your payoff is determined by your level of satisfaction with the Worker’s service minus the <b>tip</b> paid to the Worker. Your level of satisfaction with the Worker’s service is determined by the Worker’s effort level. That is, the higher the effort level the Worker chooses to serve you, the higher your level of satisfaction with the Worker’s service. </div>
                            <br/>
                            <div>The worker’s effort level can range from 1 to 10. That is, the Worker can provide a minimum effort level of 1, a maximum effort level of 10, or anywhere in between.</div>
                            <br/>
                            <div>Please note that you will decide how much to tip the Worker in each round. The amount of tip can range from <b>zero up to 80 tokens.</b> That is, you can tip nothing, can tip a maximum of 80 tokens, or can tip anywhere in between. Importantly, you tip the Worker <b>after</b> he/she serves you. </div>
                            <br/>
                            <div>For example, suppose the Worker you are paired with chooses an effort level of 0.6, and then you decide to tip 40 tokens. The payoff for you in this round will be 60 + 0.6*200 – 40 = 140 tokens. </div> 
                        </div>
                    )
                }

                <div style={{color:'#1c1c1c',fontSize:'2.3rem'}}><b>Workers’ Cost of Effort and Compensation</b></div>
                <br/>
                <div>Importantly, <b>Workers’ cost of effort increases with their effort levels.</b> The higher the effort levels they choose to serve you, the higher their cost of effort. At the end of this study, Workers’ cost of effort will determine their compensation. The higher the Workers’ cost of effort, the <b>lower</b> the compensation they will receive.</div>
                <br/>
                {
                  showSC && (
                    <div>However, the service charge you pay the Workers increases the Workers’ compensation.</div>
                  )
                }
                {
                  showPre && (
                    <div>However, the tip you pay the Worker increases the Workers’ compensation. The higher the tip, the higher the compensation they will receive.</div>
                  )
                }
                {
                  showPost && (
                    <div>However, the tip you pay the Worker increases the Workers’ compensation. The higher the tip, the higher the compensation they will receive.</div>
                  )
                }
            </div>
            <br/>
            <div style={{
              fontSize:'2.3rem'
            }}>Please click ‘Next’ to continue.</div>
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
                  color: 'black',
                  backgroundColor: '#1c1c1c',
                  color:'aliceblue',
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

export default Screen5;
