import React, { useEffect, useState } from "react";
import "./adminDashboard.scss";
import { MdOutlineContentCopy } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AdminDashboard() {
  const navigate = useNavigate();
  const [inp, setInp] = useState({
    participants: "",
    condition: "",
  });
  const [link, setLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const handleInp = (e) => {
    const { name, value } = e.target;
    setInp({ ...inp, [name]: value });
  };

  const generateLink = async (participants, condition) => {
    console.log(23, REACT_APP_BACKEND_URL)
    setCopySuccess("");
    const obj = {
      participants,
      condition
    };
    if (!participants || !condition) {
      alert("Enter details");
    } else if (participants % 2 !== 0) {
      alert("Participants should be even number");
      setInp({ ...inp, participants: "" });
    } else {
      try {
        console.log(36, REACT_APP_BACKEND_URL)
        const response = await axios
          .post(`${REACT_APP_BACKEND_URL}/generate/link`, obj, {
            withCredentials: true,
          })
          .then(async(res) => {
            if (res.data.msg === "generated") {
              localStorage.setItem('token',res.data.token)
              console.log(41, res)
              setLink(res.data.link);
              navigate('/adminpage')
            }
          });

      } catch (err) {
        console.log(28, err);
      }
    }
  };

  const copyclicked = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess("Copied!");
    } catch (e) {
      setCopySuccess("Failed to Copy!");
    }
  };

  useEffect(() => {
    if (link) {
      console.log("Link has been set:", link);
    }
  }, [link]); 

  return (
    <>
      <div className="admin-dashboard-outer">
        <div className="admin-dashoard-content">
          <div
            style={{
              color: "black",
              fontSize: "3rem",
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <u>WELCOME!</u>
          </div>

          <div className="admin-dashbaord-row">
            <label className="admin-dashboard-label">
              Number of Participants:{" "}
            </label>
            <input
              type="Number"
              placeholder="Enter Participants"
              className="admin-dashboard-input"
              value={inp.participants}
              name="participants"
              onChange={handleInp}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "0.8rem",
            }}
          >
            <label
              style={{
                color: "black",
                fontSize: "2.3rem",
                letterSpacing: "0.05rem",
              }}
            >
              Experimental condition:
            </label>
            <select
              name="condition"
              value={inp.condition}
              onChange={handleInp}
              style={{
                backgroundColor: "transparent",
                color: "black",
                width: "25rem",
                padding: "0.5rem",
                fontSize: "2.3rem",
                border: "1px solid black",
                outline: "none",
              }}
            >
              <option value="" disabled>
                Choose One
              </option>
              <option value="Fixed Condition">Fixed Condition</option>
              <option value="Service Charge">Service Charge</option>
              <option value="Pre-Tip">Pre-Tip</option>
              <option value="Post-Tip">Post-Tip</option>
            </select>
          </div>

          <div
            className="admin-dashbaord-generate"
            onClick={() => generateLink(inp.participants, inp.condition)}
          >
            Generate a Link
          </div>
          {link && (
            <div
              style={{
                color: "black",
                letterSpacing: "0.09rem",
                marginTop: "2rem",
                display: "flex",
                border: "1px solid #6AD4DD",
                padding: "0.5rem",
                justifyContent: "space-between",
              }}
            >
              Generated Link :<div style={{ color: "#6AD4DD" }}>{link}</div>
              <MdOutlineContentCopy
                onClick={() => copyclicked(link)}
                style={{
                  cursor: "pointer",
                  color: "#6AD4DD",
                  fontSize: "2.3rem",
                }}
              />
            </div>
          )}
          <div>
            {copySuccess && (
              <div
                style={{
                  color: "white",
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
      </div>
    </>
  );
}

export default AdminDashboard;
