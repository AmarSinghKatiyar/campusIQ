import { useState, useEffect } from 'react';
import api from './api';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/assessments');
        setAssessments(response.data.data || []);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('Failed to load assessments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (loading) {
    return (
      <div className="opportunities-page">
        <div className="page-header">
          <h2>Assessments</h2>
          <p>
            Complete your upcoming assessments before the deadline.
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-page">
        <div className="page-header">
          <h2>Assessments</h2>
          <p>
            Complete your upcoming assessments before the deadline.
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#d32f2f' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="opportunities-page">
      <div className="page-header">
        <h2>Assessments</h2>
        <p>
          Complete your upcoming assessments before the deadline.
        </p>
      </div>

      <div className="opportunities-grid">
        {assessments.length > 0 ? (
          assessments.map((assessment) => (
            <div className="opportunity-card" key={assessment._id}>
              <div className="opportunity-header">
                <div>
                  <h3>{assessment.title}</h3>
                  <p>{assessment.subject}</p>
                </div>
              </div>

              <p
                style={{
                  margin: '15px 0',
                  color: '#666',
                  lineHeight: '1.5',
                }}
              >
                {assessment.description}
              </p>

              <p
                style={{
                  fontWeight: 600,
                  marginBottom: '18px',
                }}
              >
                Deadline : {new Date(assessment.deadline).toLocaleDateString()}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                }}
              >
                <button
                  className="apply-btn"
                  onClick={() => window.open(assessment.pdfUrl, '_blank')}
                >
                  View PDF
                </button>

                <button
                  className="details-btn"
                  onClick={() => window.open(assessment.pdfUrl, '_blank')}
                >
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No assessments found.</p>
        )}
      </div>
    </div>
  );
}
