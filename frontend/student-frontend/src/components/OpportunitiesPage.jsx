import React, { useState, useEffect } from 'react';
import OpportunityCard from '../components/OpportunityCard';
import axios from 'axios';

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/opportunities');
        setOpportunities(response.data.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch opportunities. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading Opportunities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Available Opportunities
      </h1>
      {opportunities.length > 0 ? (
        <div>
          {opportunities.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No opportunities available at the moment.</p>
      )}
    </div>
  );
};

export default OpportunitiesPage;
