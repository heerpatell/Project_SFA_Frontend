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
    await axios.post(`${REACT_APP_BACKEND_URL}/generate/postamount`,{'token':localStorage.getItem('token'), lastRoundCumulativeComp, pnumber, condition} ,{
      withCredentials: true,
    })
    .then((res)=>{
  
    })
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

  const isFormValid = () => {
    return (
      gender && 
      age && 
      workExperience && 
      foodIndustryExperience 
    );
  };
  
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
          <br/>
          <div>
            <div style={{ color: "#1c1c1c" }}>Please indicate your gender:</div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={handleGenderChange}
                  style={{ marginRight: '0.5rem' , width: '20px', height: '20px'}}
                />
                Male
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Female"
                  style={{ marginRight: '0.5rem' , width: '20px', height: '20px'}}
                  checked={gender === "Female"}
                  onChange={handleGenderChange}
                />
                Female
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Non-Binary"
                  checked={gender === "Non-Binary"}
                  onChange={handleGenderChange}
                  style={{ marginRight: '0.5rem' , width: '20px', height: '20px'}}
                />
                Non-Binary
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Self-Define"
                  checked={gender === "Self-Define"}
                  onChange={handleGenderChange}
                  style={{ marginRight: '0.5rem' , width: '20px', height: '20px'}}
                />
                I prefer to self-define: <input
                  type="text"
                  value={gender === "Self-Define" ? gender : ""}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ fontSize:'2.3rem',marginLeft: "0.5rem", width: '200px', height: '40px', border: "1px solid #ccc", borderRadius: "5px", padding: "0.2rem" }}
                />
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  value="Prefer not to say"
                  checked={gender === "Prefer not to say"}
                  onChange={handleGenderChange}
                  style={{ marginRight: '0.5rem' , width: '20px', height: '20px'}}
                />
                I prefer not to say
              </label>
            </div>
          </div>

          <div>
            <div style={{ color: "#1c1c1c" }}>Please indicate your age (in years):</div>
            <input
              type="number"
              value={age}
              onChange={handleAgeChange}
              min={0}
              style={{
                padding: "1rem",
                fontSize:'2.3rem',
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "#1c1c1c",
                width: '100px', height: '40px'
              }}
            />
          </div>
          <br/>
          <div>
            <div style={{ color: "#1c1c1c" }}>Please indicate the number of months of your full-time or part-time work experience :</div>
            <input
              type="number"
              value={workExperience}
              onChange={handleWorkExperienceChange}
              min={0}
              style={{
width: '100px', height: '40px',
fontSize:'2.3rem',
                padding: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "#1c1c1c",
              }}
            />
          </div>
          <br/>

          <div>
            <div style={{ color: "#1c1c1c" }}>Please indicate the number of months of your full-time or part-time work experience specifically in the food industry :</div>
            <input
              type="number"
              value={foodIndustryExperience}
              onChange={handleFoodIndustryExperienceChange}
              min={0}
              style={{
                width: '100px', height: '40px',
                fontSize:'2.3rem',
                padding: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "black",
              }}
            />
          </div>
          <br/>

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
              onClick={isFormValid() ? clickedNext : null}
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
