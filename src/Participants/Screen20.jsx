import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Screen20() {
  const navigate = useNavigate();
  let { pnumber, condition, currentround } = useParams();
  pnumber = Number(pnumber);
  const [showFC, setShowFc] = useState(false);
  const [showSC, setShowSC] = useState(false);
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [fetchedData, setFetchedData] = useState();
  const [lastRoundCumulativeComp, setLastRoundCumulativeComp] = useState(0);

  const renderTable = () => {
    if (!fetchedData) {
      return (
        <tr>
          <td colSpan="4" style={tdStyle}>
            Loading...
          </td>
        </tr>
      );
    }

    console.log("Fetched Data:", fetchedData); // Debug: Check the fetchedData structure

    let cumulativeComp = 0; // Initialize cumulative compensation
    // Filter out 'practice_round' and limit rows based on currentround
    return Object.keys(fetchedData)
      .filter(
        (roundKey) =>
          roundKey !== "practice_round" &&
          parseInt(roundKey) <= parseInt(currentround)
      )
      .map((roundKey, index) => {
        // Find the matching customer based on `pnumber`
        console.log(40, pnumber);
        const roundData = fetchedData[roundKey].find(
          (data) => data.customer === pnumber
        );

        console.log(`Round: ${roundKey}, Data:`, roundData); // Debug: Check each round's data

        // If no matching customer is found, skip this round
        if (!roundData) return 0;

        // Calculate TotalComp for this round
        const totalComp = 60 + (roundData.effort * 200);

        // Add this round's TotalComp to the cumulativeComp
        cumulativeComp += totalComp;

        return (
          <tr key={index}>
            <td style={tdStyle}>{roundKey}</td>
            <td style={tdStyle}>60 tokens</td>
            <td style={tdStyle}>{roundData.effort * 200} tokens</td>
            <td style={tdStyle}>{60 + (roundData.effort * 200)} tokens</td>
          </tr>
        );
      });
  };

  const renderTableSC = () => {
    if (!fetchedData) {
      return (
        <tr>
          <td colSpan="4" style={tdStyle}>
            Loading...
          </td>
        </tr>
      );
    }

    // console.log("Fetched Data:", fetchedData); 

    let cumulativeComp = 0; // Initialize cumulative compensation
    // Filter out 'practice_round' and limit rows based on currentround
    return Object.keys(fetchedData)
      .filter(
        (roundKey) =>
          roundKey !== "practice_round" &&
          parseInt(roundKey) <= parseInt(currentround)
      )
      .map((roundKey, index) => {
        // Find the matching customer based on `pnumber`
        const roundData = fetchedData[roundKey].find(
          (data) => data.customer === pnumber
        );

        console.log(`Round: ${roundKey}, Data:`, roundData); // Debug: Check each round's data

        // If no matching customer is found, skip this round
        if (!roundData) return 0;

        // Calculate TotalComp for this round
        const totalComp = 60 + (roundData.effort * 200) - 40;

        // Add this round's TotalComp to the cumulativeComp
        cumulativeComp += totalComp;

        return (
          <tr key={index}>
            <td style={tdStyle}>{roundKey}</td>
            <td style={tdStyle}>60 tokens</td>
            <td style={tdStyle}>{roundData.effort * 200} tokens</td>
            <td style={tdStyle}>40 tokens</td>
            <td style={tdStyle}>{60 + (roundData.effort * 200) - 40} tokens</td>
          </tr>
        );
      });
  };

  const renderTablePre = () => {
    if (!fetchedData) {
      return (
        <tr>
          <td colSpan="4" style={tdStyle}>
            Loading...
          </td>
        </tr>
      );
    }

    console.log("Fetched Data:", fetchedData); // Debug: Check the fetchedData structure

    let cumulativeComp = 0; // Initialize cumulative compensation
    
    const effortToTokens = {
      0.1: 0,
      0.2: 5,
      0.3: 10,
      0.4: 20,
      0.5: 30,
      0.6: 40,
      0.7: 50,
      0.8: 60,
      0.9: 75,
      1.0: 90
    };
  
    // Filter out 'practice_round' and limit rows based on currentround
    return Object.keys(fetchedData)
      .filter(
        (roundKey) =>
          roundKey !== "practice_round" &&
          parseInt(roundKey) <= parseInt(currentround)
      )
      .map((roundKey, index) => {
        // Find the matching customer based on `pnumber`
        const roundData = fetchedData[roundKey].find(
          (data) => data.customer === pnumber
        );
        if (!roundData) return 0;
        const effortTokens = Number(effortToTokens[roundData.effort]) || 0; 
        const totalComp = 60 + (roundData.effort*200) - roundData.pretip ;
        cumulativeComp += totalComp;

        return (
          <tr key={index}>
            <td style={tdStyle}>{roundKey}</td>
            <td style={tdStyle}>60 tokens</td>
            <td style={tdStyle}>{roundData.effort * 200} tokens</td>
            <td style={tdStyle}>{roundData.pretip}</td>
            <td style={tdStyle}>{totalComp} tokens</td>
          </tr>
        );
      });
  };

  const renderTablePost = () => {
    if (!fetchedData) {
      return (
        <tr>
          <td colSpan="4" style={tdStyle}>
            Loading...
          </td>
        </tr>
      );
    }

    console.log("Fetched Data:", fetchedData); // Debug: Check the fetchedData structure

    let cumulativeComp = 0; // Initialize cumulative compensation
    
    const effortToTokens = {
      0.1: 0,
      0.2: 5,
      0.3: 10,
      0.4: 20,
      0.5: 30,
      0.6: 40,
      0.7: 50,
      0.8: 60,
      0.9: 75,
      1.0: 90
    };
  
    // Filter out 'practice_round' and limit rows based on currentround
    return Object.keys(fetchedData)
      .filter(
        (roundKey) =>
          roundKey !== "practice_round" &&
          parseInt(roundKey) <= parseInt(currentround)
      )
      .map((roundKey, index) => {
        // Find the matching customer based on `pnumber`
        const roundData = fetchedData[roundKey].find(
          (data) => data.customer === pnumber
        );
        if (!roundData) return 0;
        const effortTokens = Number(effortToTokens[roundData.effort]) || 0; 
        const totalComp = 60  + (roundData.effort*200) - roundData.pretip; 
        cumulativeComp += totalComp;

        return (
          <tr key={index}>
            <td style={tdStyle}>{roundKey}</td>
            <td style={tdStyle}>60 tokens</td>
            <td style={tdStyle}>{roundData.effort * 200} tokens</td>
            <td style={tdStyle}>{roundData.pretip}</td>
            <td style={tdStyle}>{totalComp} tokens</td>
          </tr>
        );
      });
  };

  const fetchSummary = async (condition) => {
    try {
      const res = await axios.post(
        `${REACT_APP_BACKEND_URL}/generate/fetchsummary`,
        {'token':localStorage.getItem('token')},
        {
          withCredentials: true,
        }
      );
      setFetchedData(res.data.matches.matches);
      console.log(113, res.data.matches.matches);

      if (condition == 'Fixed Condition') {
        if (!res.data.matches.matches) return;

        let cumulativeComp = 0;

        // Filter the rounds
        const filteredRounds = Object.keys(res.data.matches.matches).filter(
          (roundKey) =>
            roundKey !== "practice_round" &&
            parseInt(roundKey) <= parseInt(currentround)
        );

        filteredRounds.forEach((roundKey, index) => {
          const roundData = res.data.matches.matches[roundKey].find(
            (data) => data.customer === Number(pnumber)
          );
          const effortComp = roundData.effort * 200;
          const totalComp = 60 + effortComp;

          cumulativeComp += totalComp;
          // Only set lastRoundCumulativeComp when the last round is processed
          if (index + 1 === Number(currentround)) {
            setLastRoundCumulativeComp(cumulativeComp);
          }
        });
      }
      if (condition == 'Service Charge') {
        if (!res.data.matches.matches) return;

        const effortToTokens = {
          0.1: 0,
          0.2: 5,
          0.3: 10,
          0.4: 20,
          0.5: 30,
          0.6: 40,
          0.7: 50,
          0.8: 60,
          0.9: 75,
          1.0: 90,
        };

        let cumulativeComp = 0;

        // Filter the rounds
        const filteredRounds = Object.keys(res.data.matches.matches).filter(
          (roundKey) =>
            roundKey !== "practice_round" &&
            parseInt(roundKey) <= parseInt(currentround)
        );

        filteredRounds.forEach((roundKey, index) => {
          const roundData = res.data.matches.matches[roundKey].find(
            (data) => data.customer === Number(pnumber)
          );
          const effortTokens = Number(effortToTokens[roundData.effort]) || 0;
          const totalComp = 60 + (roundData.effort * 200) - 40;
          cumulativeComp += totalComp;

          // Only set lastRoundCumulativeComp when the last round is processed
          if (index + 1 === Number(currentround)) {
            setLastRoundCumulativeComp(cumulativeComp);
          }
        });
      }
      if (condition == 'Pre-Tip') {
        if (!res.data.matches.matches) return;

        const effortToTokens = {
          0.1: 0,
          0.2: 5,
          0.3: 10,
          0.4: 20,
          0.5: 30,
          0.6: 40,
          0.7: 50,
          0.8: 60,
          0.9: 75,
          1.0: 90,
        };

        let cumulativeComp = 0;

        // Filter the rounds
        const filteredRounds = Object.keys(res.data.matches.matches).filter(
          (roundKey) =>
            roundKey !== "practice_round" &&
            parseInt(roundKey) <= parseInt(currentround)
        );

        filteredRounds.forEach((roundKey, index) => {
          const roundData = res.data.matches.matches[roundKey].find(
            (data) => data.customer === Number(pnumber)
          );
          const effortTokens = Number(effortToTokens[roundData.effort]) || 0;
          const totalComp = 60 + (roundData.effort*200)- roundData.pretip;

          cumulativeComp += totalComp;

          // Only set lastRoundCumulativeComp when the last round is processed
          if (index + 1 === Number(currentround)) {
            setLastRoundCumulativeComp(cumulativeComp);
          }
        });
      }
      if (condition == 'Post-Tip') {
        if (!res.data.matches.matches) return;

        const effortToTokens = {
          0.1: 0,
          0.2: 5,
          0.3: 10,
          0.4: 20,
          0.5: 30,
          0.6: 40,
          0.7: 50,
          0.8: 60,
          0.9: 75,
          1.0: 90,
        };

        let cumulativeComp = 0;

        // Filter the rounds
        const filteredRounds = Object.keys(res.data.matches.matches).filter(
          (roundKey) =>
            roundKey !== "practice_round" &&
            parseInt(roundKey) <= parseInt(currentround)
        );

        filteredRounds.forEach((roundKey, index) => {
          const roundData = res.data.matches.matches[roundKey].find(
            (data) => data.customer === pnumber
          );
          console.log(432, roundData)
          const effortTokens = Number(effortToTokens[roundData.effort]) || 0;
          const totalComp = 60 + (roundData.effort*200) - roundData.pretip;
          cumulativeComp += totalComp;

          // Only set lastRoundCumulativeComp when the last round is processed
          if (index + 1 === Number(currentround)) {
            setLastRoundCumulativeComp(cumulativeComp);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

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
    fetchSummary(condition);
  }, [condition]);

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "aliceblue",
    color: "#1c1c1c",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    flexDirection: "column",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "1.5rem",
  };

  const thStyle = {
    border: "1px solid #1c1c1c",
    padding: "2.5rem 2rem",
    textAlign: "center",
    fontSize:'2.3rem',
    color:'aliceblue',
    opacity:'0.5',
    backgroundColor: "#333333",
  };

  const tdStyle = {
    border: "1px solid #1c1c1c",
    padding: "2.5rem 2rem",
    textAlign: "center",
  };

  const buttonStyle = {
    cursor: 'pointer',
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
  };

  const clickedNext = async () => {
    let cumulativeComp = 0;

    if (currentround === "10") {
      if(condition === "Fixed Condition" || condition == "Service Charge"){
        navigate(`/screen27/${pnumber}/${condition}/${lastRoundCumulativeComp}`);
      }else{
        navigate(`/screen21/${pnumber}/${condition}/${lastRoundCumulativeComp}`);
      }
    } else {
      await axios
        .post(`${REACT_APP_BACKEND_URL}/generate/screen11reachedcountincrease`,{'token':localStorage.getItem('token')} ,{
          withCredentials: true,
        })
        .then(async (res) => {
          if (res.data.msg === "activeAtMoment") {
            console.log(15, res.data);
          }
          console.log(17, res.data);
          navigate(
            `/screen11/${pnumber}/${condition}/${res.data.activeatpg11}`
          );
        });
    }
  };

  return (
    <div style={containerStyle}>
      {currentround > 0 && currentround <= 10 && (
        <>
          <div
            style={{
              fontSize: "3rem",
              paddingBottom: "1rem",
              textAlign: "center",
            }}
          >
                        <u style={{ textTransform: "uppercase" }}>
              {currentround === "Practice Round" ? (
                <b>CUMULATIVE RESULTS &nbsp;|&nbsp; {currentround}</b>
              ) : (
                <b>CUMULATIVE RESULTS &nbsp;|&nbsp; ROUND {currentround}</b>
              )}
            </u>
                     </div>
          <br/>
          <br/>
          {showFC && (
            <div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Round</th>
                    <th style={thStyle}>Base Payoff</th>
                    <th style={thStyle}>Satisfaction from Worker’s Service</th>
                    <th style={thStyle}>Total Payoff</th>
                  </tr>
                </thead>
                <tbody>{renderTable()}</tbody>
              </table>
              <br/>
              <br/>
              <div style={{ fontSize: "2.3rem", paddingBottom: "1rem" }}>
                As a Customer, you have earned a total of{" "}
                {lastRoundCumulativeComp} tokens in {currentround} round(s).
              </div>
              <br/>
            </div>
          )}
          {showSC && (
            <div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Round</th>
                    <th style={thStyle}>Base Payoff</th>
                    <th style={thStyle}>Satisfaction from Worker’s Service</th>
                    <th style={thStyle}>Service Charge Paid to the Worker</th>
                    <th style={thStyle}>Total Payoff</th>
                  </tr>
                </thead>
                <tbody>{renderTableSC()}</tbody>
              </table>
              <br/>
              <br/>
              <div style={{ fontSize: "2.3rem", paddingBottom: "1rem" }}>
                As a Customer, you have earned a total of{" "}
                {lastRoundCumulativeComp} tokens in {currentround} round(s).
              </div>
              <br/>
            </div>
          )}
          {showPre && (
            <div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Round</th>
                    <th style={thStyle}>Base Payoff</th>
                    <th style={thStyle}>Satisfaction from Worker’s Service</th>
                    <th style={thStyle}>Tip Paid to the Worker</th>
                    <th style={thStyle}>Total Payoff</th>
                  </tr>
                </thead>
                <tbody>{renderTablePre()}</tbody>
              </table>
              <br/>
              <br/>
              <div style={{ fontSize: "2.3rem", paddingBottom: "1rem" }}>
                As a Customer, you have earned a total of{" "}
                {lastRoundCumulativeComp} tokens in {currentround} round(s).
              </div>
              <br/>
            </div>
          )}
          {showPost && (
            <div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Round</th>
                    <th style={thStyle}>Base Payoff</th>
                    <th style={thStyle}>Satisfaction from Worker’s Service</th>
                    <th style={thStyle}>Tip Paid to the Worker</th>
                    <th style={thStyle}>Total Payoff</th>
                  </tr>
                </thead>
                <tbody>{renderTablePost()}</tbody>
              </table>
              <br/>
              <br/>
              <div style={{ fontSize: "2.3rem", paddingBottom: "1rem" }}>
                As a Customer, you have earned a total of {lastRoundCumulativeComp} tokens
                in {currentround} round(s).
              </div>
              <br/>
            </div>
          )}
          <div style={buttonStyle} onClick={clickedNext}>
            Next
          </div>

        </>
      )}
    </div>
  );
}

export default Screen20;
