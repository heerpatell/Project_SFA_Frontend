import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Screen25() {
  const { pnumber, condition, lastRoundCumulativeComp } = useParams();
  const [response, setResponse] = useState('');

  const navigate = useNavigate();

  const handleResponse = (event) => {
    setResponse(event.target.value);
    console.log("Current response:", event.target.value); // Debugging log
  };

  const clickedNext = async () => {
    console.log("Clicked Next with response:", response); // Debugging log
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/postresponse`, { pnumber, condition, response, 'token': localStorage.getItem('token') }, { withCredentials: true })
      .then((res) => {
        navigate(`/screen27/${pnumber}/${condition}/${lastRoundCumulativeComp}`);
      });
  };

  const verifyUser = () => {
    axios
      .post(`${REACT_APP_BACKEND_URL}/generate/getlink`, { 'token': localStorage.getItem('token') }, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("User verification response:", res.data); // Debugging log
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
  }, []);

  return (
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
            color: "#1c1c1c",
            fontSize: "3rem",
            textAlign: "center",
          }}
        >
          <u>POST STUDY QUESTIONS</u>
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
            Recall that you played the role of Worker today.
          </div>
          <div style={{ paddingBottom: '0.3rem' }}>
            Given your experience today, please describe the reasons why you chose your effort levels to serve the Customer?
          </div>
          <textarea
            value={response}
            onChange={handleResponse}
            rows="13"
            style={{
              width: "100%",
              fontSize:'2.3rem',
              padding: "0.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              color: "black",
              resize: "vertical",
            }}
          />
          <button
            style={{
              cursor: response?'pointer':'not-allowed',
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
              alignItems: 'center',
              opacity: response ? 1 : 0.5, 
            }}
            onClick={clickedNext}
            disabled={!response} 
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Screen25;
