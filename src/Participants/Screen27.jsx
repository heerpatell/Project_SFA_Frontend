import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Screen27() {
  const {pnumber, condition,lastRoundCumulativeComp} = useParams()
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [foodIndustryExperience, setFoodIndustryExperience] = useState('');
  const navigate = useNavigate()
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleWorkExperienceChange = (event) => {
    setWorkExperience(event.target.value);
  };

  const handleFoodIndustryExperienceChange = (event) => {
    setFoodIndustryExperience(event.target.value);
  };

  const clickedNext = async() => {
    const userResp = {
      gender, age, workExperience, foodIndustryExperience,pnumber,  'token': localStorage.getItem('token')
    }
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/postanswersfrom27`,userResp,{withCredentials:true})
    .then((res)=>{
      console.log(35,res)
      navigate(`/screen28/${pnumber}/${condition}/${lastRoundCumulativeComp}`)
      if(res.data.msg == 'Participant updated successfully'){
        navigate(`/screen28/${pnumber}/${condition}/${lastRoundCumulativeComp}`)
      }else{
        console.log(38, 'else part')
        navigate(`/screen28/${pnumber}/${condition}/${lastRoundCumulativeComp}`)
      }
    })
  };

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
          width: "100rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.4rem",
          fontSize: "2.3rem",
        }}
      >

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
            In order to help us understand why your responses might be different from those of other participants in this study, please answer the following questions.
          </div>
          <div>
            <div style={{ color: "#1c1c1c" }}>Please indicate your gender:</div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={handleGenderChange}
                  style={{ marginRight: "0.5rem" }}
                />
                Male
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={handleGenderChange}
                  style={{ marginRight: "0.5rem" }}
                />
                Female
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Non-Binary"
                  checked={gender === "Non-Binary"}
                  onChange={handleGenderChange}
                  style={{ marginRight: "0.5rem" }}
                />
                Non-Binary
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Self-Define"
                  checked={gender === "Self-Define"}
                  onChange={handleGenderChange}
                  style={{ marginRight: "0.5rem" }}
                />
                I prefer to self-define: <input
                  type="text"
                  value={gender === "Self-Define" ? gender : ""}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ marginLeft: "0.5rem", border: "1px solid #ccc", borderRadius: "5px", padding: "0.2rem" }}
                />
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Prefer not to say"
                  checked={gender === "Prefer not to say"}
                  onChange={handleGenderChange}
                  style={{ marginRight: "0.5rem" }}
                />
                I prefer not to say
              </label>
            </div>
          </div>

          <div>
            <div style={{ color: "#1c1c1c" }}>Please indicate your age (in years):</div>
            <br/>
            <input
              type="number"
              value={age}
              onChange={handleAgeChange}
              min={0}
              style={{
                width: "10%",
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "#1c1c1c",
              }}
            />
          </div>

          <div>
            <div style={{ color: "#1c1c1c" }}>Please indicate the number of months of your full-time or part-time work experience :</div>
            <br/>
            <input
              type="number"
              value={workExperience}
              onChange={handleWorkExperienceChange}
              min={0}
              style={{
                width: "10%",
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "#1c1c1c",
              }}
            />
          </div>

          <div>
            <div style={{ color: "#1c1c1c" }}>Please indicate the number of months of your full-time or part-time work experience specifically in the food industry :</div>
            <br/>
            <input
              type="number"
              value={foodIndustryExperience}
              onChange={handleFoodIndustryExperienceChange}
              min={0}
              style={{
                width: "10%",
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "black",
              }}
            />
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
                cursor: (gender && age && workExperience && foodIndustryExperience) ? 'pointer':'not-allowed',
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
                opacity: (gender && age && workExperience && foodIndustryExperience) ? '1':'0.5',
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

export default Screen27;
