import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen18() {
  const navigate = useNavigate()
  let { pnumber, condition,currentround } = useParams();
  const [updatedCurrentRound, setUpdatedCurrentRound] = useState()
  const [showFC, setShowFc] = useState(false);
  const [showSC, setShowSC] = useState(false);
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [effort, setEffort] = useState()
  const [tip, setTip] = useState(0)
  const [roundInfo, setRoundInfo] = useState()

  if(currentround == 0){
    currentround = 'Practice Round'
  }
    const verifyUser = () => {
    axios
      .post(`${REACT_APP_BACKEND_URL}/generate/getlink`,{'token': localStorage.getItem('token')}, {
        withCredentials: true,
      })
      .then(async(res) => {
        console.log(21, res.data);
        if (res.data.msg === "access denied") {
          navigate("/notfound");
        }
        await axios.post(`${REACT_APP_BACKEND_URL}/generate/getroundinfo`,{'token': localStorage.getItem('token'), currentround, pnumber},{withCredentials:true})
        .then(async(res)=>{
          await setRoundInfo(res.data.entry)
          console.log(59, res.data.entry)
          console.log(60, roundInfo)
        })
      })
      .catch((e) => {
        navigate("/notfound");
      });
  };
  const getEffort = async() => {
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/geteffortlevel`,{pnumber, currentround, 'token': localStorage.getItem('token')},{
      withCredentials:true
    })
    .then((res)=>{
      // console.log(36, res.data.effort)
      setEffort(res.data.effort)
    })
  }

  const getTip = async () =>{
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/gettip`,{pnumber, currentround, 'token': localStorage.getItem('token')},{
      withCredentials:true
    })
    .then((res)=>{
      console.log(36, res.data.tip)
      setTip(res.data.tip)
    })  
  }
  
  useEffect(() => {
    getEffort()
    getTip()
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

  const updateRound = async() => {
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/getroundnumber`,{'token': localStorage.getItem('token')},{
      withCredentials:true
  })
  .then((res)=>{
      setUpdatedCurrentRound(res.data.currentRound+1)
      console.log(77, res.data.currentRound)
      axios.post(`${REACT_APP_BACKEND_URL}/generate/updateroundnumber`,{currentround:res.data.currentRound+1, 'token': localStorage.getItem('token')},{
          withCredentials:true
      })
      .then((res)=>{
          console.log(36,res.data)    
      })
  })
  }

  const clickedNext = async() => {
    console.log(88, currentround)
    if(currentround == 'Practice Round'){currentround=0}
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/selectonecustomer`,{'token': localStorage.getItem('token')},{withCredentials:true})
    .then(async(res)=>{
      console.log(90, res)
      console.log(91, Number(pnumber))
      console.log(91, res.data.selectedParticipant.participant_number)
      if(Number(pnumber) == res.data.selectedParticipant.participant_number){console.log(111);await updateRound()}
    })
    .catch((e)=>{
      console.log('error :',e)
    })
    if(currentround == 0){
      navigate(`/screen10/${pnumber}/${condition}`);
    }else{
      navigate(`/screen20/${pnumber}/${condition}/${currentround}`)
    }
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
          height: "100vh",
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
            width: "65rem",
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
            <div style={{fontSize:'3rem'}}>
              
            {
                  (currentround == 'Practice Round') && (
                    <u style={{textTransform:'uppercase'}}><b>COMPENSATION OUTCOMES &nbsp;|&nbsp; {currentround}</b></u>
                  )
                  (currentround != 'Practice Round') && (
                    <u style={{textTransform:'uppercase'}}><b>COMPENSATION OUTCOMES &nbsp;|&nbsp; ROUND {currentround}</b></u>
                  )
                }
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
              {currentround === "Practice Round" && (
                <div style={{ padding: "1rem 0" }}>
                  <b>Please note that this round is for PRACTICE ONLY and will NOT
                  be paid.</b>
                </div>
              )}
              <div>Your compensation in this round is as follows:</div>

              {
                showFC && <div style={{
                    display:'flex',
                        flexDirection:'column',
                        gap:'1.3rem'
                }}>
                    <div>
                        <div>1. Your base payoff: <b>60 tokens</b></div>
                        <div>2. Your satisfaction from Worker’s service: <b>{effort*200}</b></div>
                    </div>
                    <div><b>Your total compensation in this round is: {60+(effort*200)} tokens</b></div>
                </div>
              }

              {
                showSC && <div style={{
                    display:'flex',
                        flexDirection:'column',
                        gap:'1.3rem'
                }}>
                    <div>
                        1. Your base payoff: <b>60 tokens</b><br/>
                        2. Your satisfaction from Worker’s service: <b>{effort*200} tokens</b><br/>
                        3. Service charge paid to the Worker: <b> 40 tokens</b>
                    </div>
                    <div><b>Your total compensation in this round is: {60+(effort*200)-40} tokens</b></div>
                </div>
              }
              {
                (showPre || showPost) && <div style={{
                    display:'flex',
                    flexDirection:'column',
                    gap:'1.3rem'
                }}>
                   <div>
                   1. Your base payoff: <b>60 tokens</b><br/>
                   2. Your satisfaction from Worker’s service: <b>{effort*200} tokens</b> <br/>
                   3. Tip paid to the Worker: <b>{tip} tokens</b>
                   </div>

                   <div><b>Your total compensation in this round is: {60+(effort*200)-tip} tokens</b></div>
                  </div>
              }
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

export default Screen18;
