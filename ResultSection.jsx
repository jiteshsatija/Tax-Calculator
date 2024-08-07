import React from 'react';
import PropTypes from 'prop-types';

const ResultSection = ({ taxResult }) => {
  return (
    <div className="result-section">
      <h2>Tax Calculation Results</h2>
      <p>Total tax (Old regime): ₹{taxResult.oldRegime.toFixed(2)}</p>
      <p>Total tax (New regime): ₹{taxResult.newRegime.toFixed(2)}</p>
    </div>
  );
};

ResultSection.propTypes = {
  taxResult: PropTypes.shape({
    oldRegime: PropTypes.number.isRequired,
    newRegime: PropTypes.number.isRequired,
  }).isRequired,
};

export default ResultSection;
