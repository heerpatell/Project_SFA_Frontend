import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Screen3() {
  const [assignedCategory, setAssignedCategory] = useState('');
  const [condition, setCondition] = useState();
  const [showFC, setShowFc] = useState(false);
  const [showSC, setShowSC] = useState(false);
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const navigate = useNavigate();
  const { pnumber } = useParams();

  const verifyUser = () => {
    axios
      .post(`${REACT_APP_BACKEND_URL}/generate/getlink`, { 'token': localStorage.getItem('token') }, {
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
    verifyUser();
    axios.post(`${REACT_APP_BACKEND_URL}/generate/getassignedcategory`, { pnumber, 'token': localStorage.getItem('token') }, {
      withCredentials: true
    })
      .then((res) => {
        setAssignedCategory([res.data.assignedCategory]);
        axios.post(`${REACT_APP_BACKEND_URL}/generate/getconditionandrole`, { 'token': localStorage.getItem('token') }, {
          withCredentials: true
        })
          .then((res) => {
            setCondition([res.data.condition]);
            console.log(26, condition);
            if (condition === 'Fixed Condition') {
              setShowFc(true);
            }
            if (condition === 'Service Charge') {
              setShowSC(true);
            }
            if (condition === 'Pre-Tip') {
              setShowPre(true);
            }
            if (condition === 'Post-Tip') {
              setShowPost(true);
            }
          });
      })
      .catch((e) => {
        console.log(17, e);
      });
  }, []);

  const clickedNext = () => {
    if (assignedCategory[0] === 'Worker') {
      navigate(`/screen4/${pnumber}/${condition}`);
    }
    if (assignedCategory[0] === 'Customer') {
      navigate(`/screen5/${pnumber}/${condition}`);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); // Update checkbox state
  };

  return (
    <>
      <div style={{
        backgroundColor: 'aliceblue',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 0',
        fontSize: '1.3rem',
        color: '#1c1c1c',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ textAlign: 'center', fontSize: '2rem', color: '#1c1c1c' }}><u><b>YOUR ROLE</b></u></div>
          <div>In this study, you are assigned to the role of &nbsp;</div>
          <div style={{ textAlign: 'center' }}><b>{assignedCategory}</b></div>
          <div>Your role will remain unchanged throughout the study.</div>
          <div>Please read and accept the terms.</div>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              style={{ marginRight: '0.5rem' }}
            />
            I have read it properly. 
          </label>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              cursor: 'pointer',
              margin: 'auto',
              marginTop: '2rem',
              width: '5rem',
              borderRadius: '0.2rem',
              height: '3rem',
              fontSize: '1.4rem',
              color: 'aliceblue',
              backgroundColor: isChecked ? '#1c1c1c' : '#ccc', // Change color based on checkbox state
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: isChecked ? 'auto' : 'none', // Enable/disable pointer events
            }}
              onClick={isChecked ? clickedNext : null}>Next</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Screen3;
