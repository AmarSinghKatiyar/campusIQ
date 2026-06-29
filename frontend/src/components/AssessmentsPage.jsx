

// =============================================
// TEMPORARY DEMO DATA
//
// This hardcoded data is only for the project
// demonstration.
//
// Once the MongoDB cluster/backend is available,
// remove this array and fetch data from:
//
// GET /api/assessments
//
// Example:
//
// const response = await axios.get('/api/assessments');
// const assessments = response.data.data;
//
// =============================================

const assessments = [
  {
    id: 1,
    title: 'DBMS Mid Semester',
    subject: 'Database Management System',
    description:
      'Practice questions on SQL, Normalization, Transactions and Indexing.',
    deadline: '20 Jul 2026',
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 2,
    title: 'Operating Systems Assignment',
    subject: 'Operating Systems',
    description:
      'CPU Scheduling, Deadlocks, Paging and Memory Management.',
    deadline: '24 Jul 2026',
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 3,
    title: 'Computer Networks Quiz',
    subject: 'Computer Networks',
    description:
      'OSI Model, TCP/IP, Routing Algorithms and Switching.',
    deadline: '28 Jul 2026',
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
  },
]

export default function AssessmentsPage() {
  return (
    <div className="opportunities-page">
      <div className="page-header">
        <h2>Assessments</h2>
        <p>
          Complete your upcoming assessments before the deadline.
        </p>
      </div>

      <div className="opportunities-grid">
        {assessments.map((assessment) => (
          <div className="opportunity-card" key={assessment.id}>
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
              Deadline : {assessment.deadline}
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
        ))}
      </div>
    </div>
  )
}