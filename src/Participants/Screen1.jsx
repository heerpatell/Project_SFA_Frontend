import axios from 'axios'
import React, { useEffect } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Screen1() {
  const navigate = useNavigate()
  const {pnumber} = useParams()
  
  const clickedNext = () => {
    navigate(`/screen2/${pnumber}`)
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
      color:'#1c1c1c',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      height:'100vh',
      textAlign:'center',
      fontSize:'1.8rem'
    }}>
        <div style={{
            display:'flex',
            flexDirection:'column',
            gap:'1.8rem'
        }}>
            <div style={{
              width:'50rem',
              textAlign:'left'
            }}>
            <div style={{padding:'1.5rem 0', fontSize:'3rem', color:'#1c1c1c', textAlign:'center'}}><u><b>INTRODUCTION</b></u></div>
            {/* <div style={{padding:'0.5rem 0'}}>Welcome to this study!</div> */}
            <div style={{padding:'0.5rem 0'}}>
            This study involves decision making in groups. The amount of money you will earn depends on the decisions that you and others make. Please read all instructions carefully.
            </div>
            <div style={{padding:'0.5rem 0'}}>
            We ask that you refrain from creating any distractions while you are participating in this study. There will be moments when you will have to wait for the others to complete a particular phase of the study. Please be patient during these moments.
            </div>
            <div style={{padding:'0.5rem 0'}}>
            We promise to carry out the study in the manner described in the instructions, with no deception of any form. We promise that your rewards will be calculated exactly as described in the instructions that follow. 
            </div>
            <div style={{padding:'1rem 0'}}>
            Please click on 'Next' to start the study.
            </div>
            <div style={{
              display:'flex', 
              justifyContent:'center'              
            }}>
              <div style={{
                cursor: 'pointer',
                margin: 'auto',
                marginTop: '2rem',
                width: '5rem',
                borderRadius: '0.2rem',
                height: '3rem',
                fontSize: '1.8rem',
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
    </div>
    </>
  )
}

export default Screen1
