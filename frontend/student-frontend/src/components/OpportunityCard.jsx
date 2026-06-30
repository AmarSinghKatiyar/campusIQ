const OpportunityCard = ({ opportunity, isApplied, onApply }) => {
  const {
    _id,
    title,
    role,
    company,
    description,
    applicationLink,
    applyBy,
    deadline,
    type,
  } = opportunity;
  const opportunityTitle = title || role || 'Opportunity';
  const opportunityDeadline = deadline || applyBy;

  const formattedDeadline = opportunityDeadline
    ? new Date(opportunityDeadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Not specified';

  return (
    <article className="opportunity-card">
      <div className="opportunity-card-top">
        <div>
          <span className="opportunity-company">{company}</span>
          <h3>{opportunityTitle}</h3>
        </div>
        <span className="opportunity-type">{type}</span>
      </div>

      <p className="opportunity-description">{description}</p>

      <div className="opportunity-meta">
        <span>
          <strong>Deadline</strong>
          {formattedDeadline}
        </span>
        {applicationLink && (
          <a href={applicationLink} target="_blank" rel="noreferrer">
            Application Link
          </a>
        )}
      </div>

      <button
        type="button"
        className={`opportunity-apply-btn ${isApplied ? 'applied' : ''}`}
        onClick={() => onApply?.(_id)}
        disabled={isApplied}
      >
        {isApplied ? 'Applied' : 'Apply'}
      </button>
    </article>
  );
};

export default OpportunityCard;
