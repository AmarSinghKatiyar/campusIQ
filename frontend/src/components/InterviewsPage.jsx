import React from "react";

// ===============================================================
// TEMPORARY DEMO DATA
//
// This hardcoded data is ONLY for the demo because the MongoDB
// cluster is currently unavailable.
//
// Once the backend is connected:
//
// 1. Remove the interviewData array.
// 2. Uncomment the API code below.
// 3. No UI changes will be required.
//
// API:
// GET /api/interviews
// ===============================================================

/*
import axios from "axios";
import { useEffect, useState } from "react";

const [interviews, setInterviews] = useState([]);

useEffect(() => {
  const fetchInterviews = async () => {
    try {
      const response = await axios.get("/api/interviews");
      setInterviews(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchInterviews();
}, []);
*/

const interviewData = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineering Intern",
    round: "Technical Interview",
    date: "15 Jul 2026",
    time: "11:00 AM",
    location: "Google Meet",
    status: "Upcoming",
    meetingLink: "https://meet.google.com/",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "SDE Intern",
    round: "HR Interview",
    date: "18 Jul 2026",
    time: "2:00 PM",
    location: "Microsoft Teams",
    status: "Upcoming",
    meetingLink: "https://teams.microsoft.com/",
  },
  {
    id: 3,
    company: "Amazon",
    role: "Backend Developer Intern",
    round: "Machine Coding Round",
    date: "22 Jul 2026",
    time: "10:30 AM",
    location: "Amazon Chime",
    status: "Upcoming",
    meetingLink: "https://chime.aws/",
  },
];

function InterviewsPage() {
  return (
    <div className="p-6">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            Interviews
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: "6px",
            }}
          >
            View all your upcoming interviews.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
          gap: "22px",
        }}
      >
        {interviewData.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "22px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              border: "1px solid #ececec",
            }}
          >
            <h2
              style={{
                marginBottom: "10px",
                color: "#222",
              }}
            >
              {item.company}
            </h2>

            <p>
              <strong>Role:</strong> {item.role}
            </p>

            <p>
              <strong>Round:</strong> {item.round}
            </p>

            <p>
              <strong>Date:</strong> {item.date}
            </p>

            <p>
              <strong>Time:</strong> {item.time}
            </p>

            <p>
              <strong>Location:</strong> {item.location}
            </p>

            <p
              style={{
                marginTop: "10px",
              }}
            >
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: "#1b8f3d",
                  fontWeight: "600",
                }}
              >
                {item.status}
              </span>
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "22px",
              }}
            >
              <button
                style={{
                  padding: "10px 18px",
                  border: "none",
                  background: "#4f46e5",
                  color: "white",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  window.open(item.meetingLink, "_blank")
                }
              >
                Join Meeting
              </button>

              <button
                style={{
                  padding: "10px 18px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  alert(
                    `${item.company}\n${item.role}\n${item.round}\n${item.date} • ${item.time}`
                  )
                }
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewsPage;