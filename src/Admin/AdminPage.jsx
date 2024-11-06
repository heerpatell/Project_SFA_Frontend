import React, { useState,useEffect } from "react";
import "./adminpage.scss";
import { MdOutlineContentCopy } from "react-icons/md";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { saveAs } from 'file-saver';
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const REACT_APP_FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

function AdminPage() {

  const navigate = useNavigate()
  const [link, setLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [participants, setParticipants] = useState()
  const [activeParticipant,setActiveParticipant] = useState(0)
  const [rounds, setRounds] = useState(10)
  const [condition, setCondition] = useState('')

  useEffect(()=>{
    axios.post(`${REACT_APP_BACKEND_URL}/generate/getlink`,{'token': localStorage.getItem('token')},{
      withCredentials:true
    })
    .then(async(res)=>{
      if(res.data.msg === 'access denied'){
        navigate('/notfound')
      }
      else{
        setLink(`${REACT_APP_FRONTEND_URL}/link/${res.data.sessionObj.link}`);
        setParticipants(res.data.sessionObj.no_of_participants);        
        setCondition(res.data.sessionObj.condition)
        console.log(41, res.data.sessionObj)
        setActiveParticipant(res.data.sessionObj.no_of_active_participants);     
      }    
    })
    .catch((e)=>{
      navigate('/notfound')
    })
  },[activeParticipant])

  const copyclicked = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess("Copied!");
    } catch (e) {
      setCopySuccess("Failed to Copy!");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/generate/exporttoexcel`,
        null,
        {
          withCredentials: true, 
          responseType: 'blob'   // Expect a blob (binary data) in response
        }
      );
  
      // Extract the filename from the Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/['"]/g, '') // Safely extracting the filename
        : 'session_data.xlsx'; // Fallback filename
  
      // Create a new blob from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Use the saveAs function to trigger a file download in the browser
      saveAs(blob, filename);
  
    } catch (error) {
      // Log the error response for debugging
      console.error('Error downloading the Excel file: ', error.response ? error.response.data : error.message);
      
      // Optional: Notify the user with a more detailed message
      const errorMsg = error.response && error.response.data 
        ? error.response.data.msg || 'Error occurred while downloading the file.'
        : 'An unexpected error occurred. Please try again later.';
      
      alert(errorMsg); // Notify the user
    }
  };  

  return (
    <>
      <div className="adminpage-outer">
        <div className="adminpage-content">
          <div style={{ display:'flex', gap:'2rem', justifyContent:'center', paddingTop:'2rem'}}>
          <div
            style={{
              color: "black",
              letterSpacing: "0.09rem",
              display: "flex",
              border: "1px solid black",
              padding: "1rem",
              width:'60rem',
              fontSize:'2.3rem',
              justifyContent: "space-between",
            }}
          >
            Generated Link :<div style={{ color: "black" }}>{link}</div>
            <MdOutlineContentCopy
              onClick={() => copyclicked(link)}
              style={{
                cursor: "pointer",
                color: "black",
                fontSize: "2.3rem",
              }}
            />
          </div>
          <div>
            {copySuccess && (
              <div
                style={{
                  color: "#1c1c1c",
                  fontSize: "2.3rem",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                {copySuccess}
              </div>
            )}
          </div>
          </div>

          <div className="secondrow-adminpage">
              <div style={{fontSize:'2.3rem', display:'flex', color:'black'}}>Number of Participants: <div style={{color:'black'}}>&nbsp;&nbsp;{participants}</div></div> 
              <div style={{fontSize:'2.3rem', display:'flex', color:'black'}}>Number of Rounds: <div style={{color:'black'}}>&nbsp;&nbsp;{rounds}</div></div>
              <div style={{fontSize:'2.3rem', display:'flex', color:'black'}}>Entered Condition: <div style={{color:'black'}}>&nbsp;&nbsp;{condition}</div></div>
          </div>

          <div
            style={{
              cursor: 'pointer',
              margin: 'auto',
              marginTop: '2rem',
              width: '25rem',
              borderRadius: '0.2rem',
              height: '5rem',
              fontSize: '2.3rem',
              color: 'aliceblue',
              backgroundColor: '#1c1c1c',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',   
            }}
            onClick={handleDownload}
          >
            Download Excel
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminPage;
