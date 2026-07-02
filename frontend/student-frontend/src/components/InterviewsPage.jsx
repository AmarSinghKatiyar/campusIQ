import React, { useEffect, useState } from "react";
import api from "./api";

function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");
        setInterviews(response.data.data);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      }
    };

    fetchInterviews();
  }, []);

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
        {interviews.length > 0 ? (
          interviews.map((item) => (
            <div
              key={item._id}
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
                <strong>Date:</strong>{" "}
                {new Date(item.date).toLocaleDateString()}
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
                    color:
                      item.status === "Upcoming"
                        ? "#1b8f3d"
                        : item.status === "Completed"
                        ? "#2563eb"
                        : "#dc2626",
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
                  onClick={() => window.open(item.meetingLink, "_blank")}
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
                      `${item.company}\n${item.role}\n${item.round}\n${new Date(
                        item.date
                      ).toLocaleDateString()} • ${item.time}`
                    )
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No interviews found.</p>
        )}
      </div>
    </div>
  );
}

export default InterviewsPage;