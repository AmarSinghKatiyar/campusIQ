import { useState } from 'react';
import OpportunityCard from '../components/OpportunityCard';

const hardcodedOpportunities = [
  {
    _id: 'sde-intern-2026',
    role: 'Software Development Intern',
    company: 'Amazon',
    description:
      'Build scalable services, solve backend problems, and work with product teams on campus hiring tools.',
    applicationLink: 'https://www.amazon.jobs/content/en/career-programs/university',
    deadline: '2026-07-18',
    type: 'Internship',
  },
  {
    _id: 'frontend-intern-2026',
    role: 'Frontend Engineer Intern',
    company: 'Adobe',
    description:
      'Create polished React interfaces, improve dashboard performance, and ship accessible user workflows.',
    applicationLink: 'https://careers.adobe.com/us/en/students',
    deadline: '2026-07-24',
    type: 'Internship',
  },
  {
    _id: 'data-analyst-trainee-2026',
    role: 'Data Analyst Trainee',
    company: 'Deloitte',
    description:
      'Analyze placement trends, prepare SQL-backed reports, and turn student engagement data into insights.',
    applicationLink: 'https://www.deloitte.com/global/en/careers/students.html',
    deadline: '2026-08-02',
    type: 'Full Time',
  },
  {
    _id: 'product-design-intern-2026',
    role: 'Product Design Intern',
    company: 'Microsoft',
    description:
      'Design student-facing product experiences, prototype flows, and collaborate with engineers on delivery.',
    applicationLink: 'https://careers.microsoft.com/students/us/en',
    deadline: '2026-08-10',
    type: 'Internship',
  },
];

const OpportunitiesPage = () => {
  const [appliedIds, setAppliedIds] = useState([]);

  const handleApply = (opportunityId) => {
    setAppliedIds((currentIds) =>
      currentIds.includes(opportunityId)
        ? currentIds
        : [...currentIds, opportunityId],
    );
  };

  return (
    <div className="opportunities-page">
      <div className="opportunities-heading">
        <h2>Available Opportunities</h2>
        <p>Explore active roles and track the ones you have applied to.</p>
      </div>

      <div className="opportunity-card-grid">
        {hardcodedOpportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity._id}
            opportunity={opportunity}
            isApplied={appliedIds.includes(opportunity._id)}
            onApply={handleApply}
          />
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesPage;
