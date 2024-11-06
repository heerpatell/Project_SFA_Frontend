import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function QuestionScale({ question, name, onChange }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div>
      <p style={{ color: "#1c1c1c", marginBottom: "0.5rem" }}>{question}</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {Array.from({ length: 7 }, (_, i) => i + 1).map((value) => (
          <React.Fragment key={value}>
            <input
              type="radio"
              id={`${name}-${value}`}
              name={name}
              value={value}
              checked={selectedValue === value.toString()}
              onChange={handleChange}
              style={{ display: "none" }}
            />
            <label
              htmlFor={`${name}-${value}`}
              style={{
                display: "block",
                padding: "0.5rem",
                cursor: "pointer",
                border: "none",
                borderRadius: "3px",
                textAlign: "center",
                backgroundColor: selectedValue === value.toString() ? "#1c1c1c" : "white",
                color: selectedValue === value.toString() ? "white" : "black",
              }}
            >
              {value}
            </label>
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "0.2rem",
          color: "gray",
          fontSize: "2.3rem",
          paddingBottom: "0.5rem",
        }}
      >
        <div style={{ color: '#1c1c1c' }}>Not at all</div>
        <div style={{ color: '#1c1c1c' }}>Somewhat</div>
        <div style={{ color: '#1c1c1c' }}>Very much</div>
      </div>
      <hr />
    </div>
  );
}

function Screen23() {
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();
  const { pnumber, condition, lastRoundCumulativeComp } = useParams();
  
  const handleScaleChange = (name, value) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  // Conditional rendering flags
  const [showTipQuestions, setShowTipQuestions] = useState(false);

  // Fetch and verify user
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
    
    // Show tip-related questions for Pre-Tip and Post-Tip conditions
    if (condition === "Pre-Tip" || condition === "Post-Tip") {
      setShowTipQuestions(true);
    }
  }, [condition, navigate]);

  const clickedNext = () => {
    console.log("Responses:", responses);
    axios
      .post(`${REACT_APP_BACKEND_URL}/generate/saveresponsesforscreen23`, { pnumber, 'token': localStorage.getItem('token'), condition, ...responses }, {
        withCredentials: true,
      })
      .then(async() => {
        await axios.post(`${REACT_APP_BACKEND_URL}/generate/getassignedcategory`,{pnumber, 'token': localStorage.getItem('token')},{
          withCredentials:true
        })
        .then((res)=>{
          if(res.data.assignedCategory == 'Worker'){
            navigate(`/screen25/${pnumber}/${condition}/${lastRoundCumulativeComp}`);
          }else{
            navigate(`/screen25c/${pnumber}/${condition}/${lastRoundCumulativeComp}`);
          }
        })
      })
      .catch((error) => {
        console.error("Error saving responses", error);
      });
  };

  // Check if all required questions are answered
  const allQuestionsAnswered = () => {
    const requiredQuestions = ["Controllability1", "Controllability2"];
    if (showTipQuestions) {
      requiredQuestions.push("TipReason_Effort", "TipReason_SocialImage", "TipReason_SocialNorm");
    }
    return requiredQuestions.every((question) => responses[question] !== undefined);
  };

  return (
    <div
      style={{
        minHeight: "100vh", // Use minHeight to occupy full screen
        backgroundColor: "aliceblue",
        color: "#1c1c1c",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // Align items to the start of the container
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.4rem",
          fontSize: "2.3rem",
          padding: '2rem',
        }}
      >
        <div
          style={{
            color: "#1c1c1c",
            fontSize: "3rem",
            textAlign: "center",
          }}
        >
          <u><b>POST-STUDY QUESTIONS</b></u>
        </div>
        <div
          style={{
            fontSize: "2.3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingTop: "2rem",
            color: "#6AD4DD",
            textAlign: "left",
          }}
        >
          <QuestionScale
            question="To what extent do you think your total compensation was affected by the effort level you chose?"
            name="Controllability1"
            onChange={(value) => handleScaleChange("Controllability1", value)}
          />
          <QuestionScale
            question="To what extent do you think you could influence your total compensation?"
            name="Controllability2"
            onChange={(value) => handleScaleChange("Controllability2", value)}
          />

          {/* Tip-related questions (for Pre-Service and Post-Service Tip conditions) */}
          {showTipQuestions && (
            <>
              <QuestionScale
                question="To what  do you perceive that the tip you received from the Customer was affected by your effort level?"
                name="TipReason_Effort"
                onChange={(value) => handleScaleChange("TipReason_Effort", value)}
              />
              <QuestionScale
                question="To what extent do you perceive that the tip you received from the Customer was affected by the social pressure to tip?"
                name="TipReason_SocialImage"
                onChange={(value) => handleScaleChange("TipReason_SocialImage", value)}
              />
              <QuestionScale
                question="To what extent do you perceive that the tip you received from the Customer was affected by how other Customers normally tip Workers?"
                name="TipReason_SocialNorm"
                onChange={(value) => handleScaleChange("TipReason_SocialNorm", value)}
              />
            </>
          )}

          <div
            style={{
              fontSize: "2.3rem",
              display: "flex",
              flexDirection: "column",
              color: '#1c1c1c',
              gap: "1rem",
            }}
          >
            Please click ‘Next’ to continue.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: '3rem'
            }}
          >
            <div
              style={{
                cursor: allQuestionsAnswered() ? 'pointer' : 'not-allowed',
                margin: 'auto',
                marginTop: '2rem',
                width: '5rem',
                borderRadius: '0.2rem',
                height: '3rem',
                fontSize: '2.3rem',
                color: 'black',
                backgroundColor: allQuestionsAnswered() ? '#1c1c1c' : 'gray', // Change color based on enabled state
                color: 'aliceblue',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={allQuestionsAnswered() ? clickedNext : undefined} // Disable click if not all questions are answered
            >
              Next
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Screen23;