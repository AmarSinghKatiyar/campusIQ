import React from 'react';
import { Link } from 'react-router-dom';

const OpportunityCard = ({ opportunity }) => {
  const { _id, title, company, type, location, stipend, applyBy } = opportunity;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-md text-gray-600">{company}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
          {type}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          <strong>Location:</strong> {location}
        </p>
        {stipend && stipend.amount && (
          <p className="text-sm text-gray-500">
            <strong>Stipend:</strong> ₹{stipend.amount} {stipend.period}
          </p>
        )}
        <p className="text-sm text-gray-500">
          <strong>Apply By:</strong> {formatDate(applyBy)}
        </p>
      </div>
      <div className="mt-6 text-right">
        <Link
          to={`/opportunities/${_id}`}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;