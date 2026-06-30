import { useEffect, useState } from "react";
import axios from "axios";

const LearningPage = () => {
  const [learning, setLearning] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/learning",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLearning(res.data.data);
      } catch (err) {
        console.error("Error fetching learning resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearning();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="learning-container">
      {learning.length === 0 ? (
        <h3>No learning resources available.</h3>
      ) : (
        learning.map((course) => (
          <div key={course._id} className="learning-card">
            <img src={course.thumbnail} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>
              <strong>Platform:</strong> {course.platform}
            </p>
            <p>
              <strong>Level:</strong> {course.level}
            </p>
            <a
              href={course.resourceLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start Learning
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default LearningPage;