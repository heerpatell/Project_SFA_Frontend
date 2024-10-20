import React,{useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen17() {
const navigate = useNavigate()
let {condition,pnumber,currentround } = useParams()
const [showFC, setShowFc] = useState(false);
const [showSC, setShowSC] = useState(false);
const [showPre, setShowPre] = useState(false);
const [showPost, setShowPost] = useState(false);
const [effort, setEffort] = useState(0)
const [cost, setCost] = useState()
const [tip, setTip] = useState(0)

if(currentround == 'Practice Round}'){
  currentround = 'Practice Round'
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
const getEffort = async() => {
  console.log(33, currentround)
  await axios.post(`${REACT_APP_BACKEND_URL}/generate/geteffortlevelworker`,{pnumber, currentround, 'token': localStorage.getItem('token')},{
    withCredentials:true
  })
  .then((res)=>{
    console.log(36, res.data.effort)
    setEffort(res.data.effort)
    if(res.data.effort == 0.1) {setCost(0)}
    if(res.data.effort == 0.2) {setCost(5)}
    if(res.data.effort == 0.3) {setCost(10)}
    if(res.data.effort == 0.4) {setCost(20)}
    if(res.data.effort == 0.5) {setCost(30)}
    if(res.data.effort == 0.6) {setCost(40)}
    if(res.data.effort == 0.7) {setCost(50)}
    if(res.data.effort == 0.8) {setCost(60)}
    if(res.data.effort == 0.9) {setCost(75)}
    if(res.data.effort == 1.0) {setCost(90)}
  })
}
  const getTip = async () =>{
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/gettipforworker`,{pnumber, currentround, 'token': localStorage.getItem('token')},{
      withCredentials:true
    })
    .then((res)=>{
      console.log(36, res.data.tip)
      setTip(res.data.tip)
    })  
  }
useEffect(() => {
  verifyUser()
  getEffort()
  getTip()
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

const clickedNext = () => {
  if(currentround == 'Practice Round'){
    navigate(`/screen10/${pnumber}/${condition}`);
  }else{
    navigate(`/screen19/${pnumber}/${condition}/${currentround}`)
  }
};

const finalMessageStyle = {
  color: "#FFD700",
  fontSize: "1.5rem",
  marginTop: "1.5rem",
  textAlign: "center",
};

return (
    <>
    <div style={{
          height: "100vh",
          backgroundColor: "aliceblue",
          color: "#1c1c1c",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}>
        <div style={{
            width: "58rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem",
            fontSize: "1.4rem",
          }}>
            <div style={{
              color: "#1c1c1c",
              fontSize: "1.5rem",
              textAlign: "center",
            }}>
              <div style={{fontSize:'2rem'}}><u style={{textTransform:'uppercase'}}><b>COMPENSATION OUTCOMES &nbsp;|&nbsp; ROUND {currentround}</b></u></div>
              <div style={{
                fontSize: "1.2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                paddingTop: "2rem",
                color: "#1c1c1c",
                textAlign: "left",
              }}>
                {
                    (currentround === 'Practice Round') && <div style={{padding:'1rem 0'}}>
                        <b>Please note that this round is for PRACTICE ONLY and will NOT be paid.</b>
                        </div>
                }
                <div>Your compensation in this round is as follows:</div>
                {
                    showFC && <div style={{
                        display:'flex',
                        flexDirection:'column',
                        gap:'1.3rem'
                    }}>
                       <div>
                       <div>1. Your wage paid by the restaurant: <b>200 tokens </b></div>
                       <div>2. Your cost of effort level: <b>{cost} tokens.</b></div>
                       </div>

                       <div><b>Your total compensation in this round is: {200-cost} tokens.</b></div>
                        </div>
                }
                {
                    showSC && <div style={{
                        display:'flex',
                        flexDirection:'column',
                        gap:'1.3rem'
                    }}>
                       <div>
                       1. Your wage paid by the restaurant: <b>160 tokens</b><br/>
                       2. Service charge paid by the Customer: <b>40 tokens</b> <br/>
                       3. Your cost of effort level: <b>{cost} tokens.</b>
                       </div>

                       <div><b>Your total compensation in this round is: {160+40-cost} tokens.</b></div>
                        </div>
                }
                {
                    (showPre || showPost) && <div style={{
                        display:'flex',
                        flexDirection:'column',
                        gap:'1.3rem'
                    }}>
                       <div>
                       1. Your wage paid by the restaurant: <b>160 tokens </b><br/>
                       2. Tip paid by the Customer: <b>{tip} tokens.</b><br/>
                       3. Your cost of effort level: <b>{cost} tokens.</b>
                       </div>

                       <div><b>Your total compensation in this round is: {160+tip-cost} tokens.</b></div>
                        </div>
                }
                              <div
                style={{
                  fontSize: "1.2rem",
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
                    width: '5rem',
                    borderRadius: '0.2rem',
                    height: '3rem',
                    fontSize: '1.4rem',
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
    </div>
    </>
  )
}

export default Screen17
