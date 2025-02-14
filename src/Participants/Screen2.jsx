import axios from 'axios'
import React,{useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen2() {
  const navigate = useNavigate()
  const {pnumber} = useParams()

  const clickedNext = () => {
    navigate(`/screen3/${pnumber}`)
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
          backgroundColor:'aliceblue',
          minHeight:'100vh',
          padding:'2rem 0',
          color:'#1c1c1c',
            display:'flex',
            justifyContent:'center',
            fontSize:'2.3rem',
            alignItems:'center',
            height:'100%',
            textAlign:'left'
          }}>
          <div style={{
            width:'100rem',
            height:'max-content',
            display:'flex',
            flexDirection:'column',
            gap:'1rem',
          }}>
            <div style={{textAlign:'center', fontSize:'3rem', marginBottom:'1rem', color:'#1c1c1c'}}><u><b>BACKGROUND</b></u></div>
            <div style={{fontSize:'2.3rem', color:'#1c1c1c'}}><b>Role</b></div>
            <div>Imagine a restaurant situated in a typical urban setting. The restaurant attracts customers with diverse needs and preferences, so the menu has a wide variety of options. </div>
            <div>In this restaurant setting, you will be randomly assigned the role of <u><b>Worker</b></u> or <u><b>Customer</b></u>. </div>
            <div>Your role will remain <b>unchanged</b> throughout the study. </div>
            <br/>
            <div style={{fontSize:'2.3rem', color:'#1c1c1c'}}><b>Rounds and Dyads</b></div>     
            <div>There will be 10 rounds in this study</div>  
            <div>In each round, you will be randomly paired with another participant in your session to form a Customer-Worker dyad. That is, if you are a Customer, then you will be paired with a Worker. If you are a Worker, then you will be paired with a Customer. You will be randomly paired with a <b>different</b> participant in your session to form a <b>new</b> Customer-Worker dyad after each round. </div>
            <br/>
            <div style={{fontSize:'2.3rem', color:'#1c1c1c'}}><b>Earnings</b></div>
            <div>During this study, your earnings will be paid in ‘tokens’ that will be converted to Canadian Dollars when you exit. Specifically, you will earn tokens based on your decisions and the decisions of the other participants you are paired with in each round. Your compensation depends on the total amount of tokens you <b>earn over all rounds</b>. At the end of the study, we will convert your tokens into actual Canadian Dollars at the rate of <b>100 tokens = $0.90 CND</b>. Thus, the more tokens you earn in each round, the more money you will receive at the end of the study.</div>
            <br/>
            <div>Please click ‘Next’ to continue.</div>
            <div style={{
              display:'flex',
              justifyContent:'center'
            }}>
              <div style={{
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
            onClick={clickedNext}>Next</div>
          </div>
            </div>
        </div>

    </>
  )
}

export default Screen2
