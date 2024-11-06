import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function QuestionScale({ question, name, onChange }) {
  const [selectedValue, setSelectedValue] = useState(null);

  const navigate = useNavigate();
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value);
  };

  const verifyUser = () => {
    axios
      .post(`${REACT_APP_BACKEND_URL}/generate/getlink`, {'token': localStorage.getItem('token')}, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.msg === "access denied") {
          navigate("/notfound");
        }
      })
      .catch(() => {
        navigate("/notfound");
      });
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <div>
      <p style={{ color: "#1c1c1c", marginBottom: "0.5rem" }}>{question}</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {Array.from({ length: 7 }, (_, i) => i + 1).map(value => (
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
      <div style={{display:'flex', justifyContent:'space-between', paddingTop:'0.2rem', color:'gray', fontSize:'2.3rem', paddingBottom:'0.5rem'}}>
        <div style={{color:'#1c1c1c'}}>Not at all</div>
        <div style={{color:'#1c1c1c'}}>Somewhat</div>
        <div style={{color:'#1c1c1c'}}>Very much</div>
      </div>
      <hr/>
    </div>
  );
}

function Screen22() {
  const [responses, setResponses] = useState({});
  const { pnumber, condition, lastRoundCumulativeComp } = useParams();
  const [showFC, setShowFc] = useState(false);
  const [showSC, setShowSC] = useState(false);
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [condition]);

  const handleScaleChange = (name, value) => {
    setResponses(prev => {
      const updatedResponses = { ...prev, [name]: value };
      
      // Update the button state based on whether all required fields are filled
      const requiredQuestions = [
        "EffortSensitivity_Manager", 
        "Observability_Manager", 
        "Observability_Customer"
      ];
      
      if (showSC) requiredQuestions.push("EffortSensitivity_Customer", "MentalAccount");
      if (showPre || showPost) requiredQuestions.push("EffortSensitivity_Customer");

      const allQuestionsAnswered = requiredQuestions.every(key => updatedResponses[key]);
      
      setIsButtonEnabled(allQuestionsAnswered);
      return updatedResponses;
    });
  };

  const saveResponses = async () => {
    try {
      const data = {
        pnumber,
        condition,
        'token': localStorage.getItem('token'),
        ...responses
      };
      await axios.post(`${REACT_APP_BACKEND_URL}/generate/saveresponses`, data, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error saving responses", error);
    }
  };

  const clickedNext = async () => {
    if (!isButtonEnabled) return; // Prevent clicking if the button is disabled
    console.log("Responses:", responses);
    await saveResponses();
    navigate(`/screen23/${pnumber}/${condition}/${lastRoundCumulativeComp}`);
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "aliceblue",
        color: "#1c1c1c",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin:0
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
            color: "#1c1c1c",
            textAlign: "left",
          }}
        >
          <div>
            <QuestionScale
              question="To what extent do you think your effort is affected by the amount of fixed wage paid by the restaurant?"
              name="EffortSensitivity_Manager"
              onChange={(value) => handleScaleChange("EffortSensitivity_Manager", value)}
            />
            {showSC && (
              <div>
                <QuestionScale
                  question="To what extent do you think your effort is affected by the amount of service charge paid by the Customer?"
                  name="EffortSensitivity_Customer"
                  onChange={(value) => handleScaleChange("EffortSensitivity_Customer", value)}
                />
              </div>
            )}
            {(showPre || showPost) && (
              <div>
                <QuestionScale
                  question="To what extent do you think your effort is affected by the amount of tip paid by the Customer?"
                  name="EffortSensitivity_Customer"
                  onChange={(value) => handleScaleChange("EffortSensitivity_Customer", value)}
                />
              </div>
            )}
          </div>

          <div>
            <QuestionScale
              question="To what extent do you think the manager at the restaurant can observe the effort level you choose to serve the Customer?"
              name="Observability_Manager"
              onChange={(value) => handleScaleChange("Observability_Manager", value)}
            />
            <QuestionScale
              question="To what extent do you think the Customer can observe the effort level you choose to serve them?"
              name="Observability_Customer"
              onChange={(value) => handleScaleChange("Observability_Customer", value)}
            />
            {showSC && (
              <QuestionScale
                question="To what extent do you think the service charge paid by the Customer is different from the fixed wage paid by the restaurant?"
                name="MentalAccount"
                onChange={(value) => handleScaleChange("MentalAccount", value)}
              />
            )}
          </div>

          <div style={{ fontSize: "2.3rem", textAlign: "center" }}>
            Please click ‘Next’ to continue.
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
                opacity: isButtonEnabled ? 1 : 0.5,
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
    </div>
  );
}

export default Screen22;
