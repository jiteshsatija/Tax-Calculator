import React from 'react';
import PropTypes from 'prop-types';

const CalculatorSection = ({ title, fields, setFields, includeToggle = false }) => {
  const handleInputChange = (key, value) => {
    setFields(prevFields => ({ ...prevFields, [key]: Number(value) }));
  };

  const handleToggleChange = () => {
    setFields(prevFields => ({ ...prevFields, isMetroCity: !prevFields.isMetroCity }));
  };

  return (
    <div className="calculator-section">
      <h2>{title}</h2>
      {Object.entries(fields).map(([key, value]) => (
        key !== 'isMetroCity' && (
          <div key={key} className="input-group">
            <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
            <input
              type="number"
              id={key}
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          </div>
        )
      ))}
      {includeToggle && (
        <div className="toggle-group">
          <label htmlFor="isMetroCity">Do you live in a metro city?</label>
          <input
            type="checkbox"
            id="isMetroCity"
            checked={fields.isMetroCity}
            onChange={handleToggleChange}
          />
        </div>
      )}
    </div>
  );
};

CalculatorSection.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.object.isRequired,
  setFields: PropTypes.func.isRequired,
  includeToggle: PropTypes.bool,
};

export default CalculatorSection;
