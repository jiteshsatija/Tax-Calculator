import React, { useState } from 'react';
import './IncomeTaxCalculator.css';

const IncomeTaxCalculator = () => {
  const [formData, setFormData] = useState({
    assessmentYear: '2023-2024',
    ageCategory: 'below60',
    grossSalary: 400000,
    otherIncome: 48483,
    interestIncome: 38939,
    rentalIncome: 44,
    selfOccupiedLoanInterest: 4848,
    letOutLoanInterest: 4893,
    section80C: 4453,
    nps80CCD: 243,
    medicalInsurance80D: 4442,
    charity80G: 243,
    educationLoan80E: 2423,
    savingsInterest80TTA: 3434,
    basicSalary: 34342,
    da: 3244,
    hra: 434,
    rentPaid: 255555556,
    isMetroCity: true,
  });

  const [taxResult, setTaxResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : Number(value)
    }));
  };

  const calculateTax = () => {
    // Calculate total income
    const totalIncome = formData.grossSalary + formData.otherIncome + formData.interestIncome + formData.rentalIncome;

    // Calculate deductions
    const totalDeductions = calculateDeductions();

    // Calculate taxable income
    const taxableIncome = Math.max(totalIncome - totalDeductions, 0);

    // Calculate tax under old regime
    const oldRegimeTax = calculateOldRegimeTax(taxableIncome);

    // Calculate tax under new regime
    const newRegimeTax = calculateNewRegimeTax(totalIncome);

    // Calculate HRA exemption
    const hraExemption = calculateHRAExemption();

    setTaxResult({
      totalIncome,
      totalDeductions,
      taxableIncome,
      oldRegimeTax,
      newRegimeTax,
      hraExemption
    });
  };

  const calculateDeductions = () => {
    let totalDeductions = 0;

    // Section 80C
    totalDeductions += Math.min(formData.section80C, 150000);

    // NPS 80CCD(1B)
    totalDeductions += Math.min(formData.nps80CCD, 50000);

    // Medical Insurance 80D
    totalDeductions += Math.min(formData.medicalInsurance80D, 25000);

    // Charity 80G (assuming 100% deduction, but this can vary)
    totalDeductions += formData.charity80G;

    // Education Loan Interest 80E (no upper limit)
    totalDeductions += formData.educationLoan80E;

    // Savings Account Interest 80TTA/TTB
    totalDeductions += Math.min(formData.savingsInterest80TTA, 10000);

    // Home Loan Interest Deduction
    if (formData.selfOccupiedLoanInterest > 0) {
      totalDeductions += Math.min(formData.selfOccupiedLoanInterest, 200000);
    }

    return totalDeductions;
  };

  const calculateOldRegimeTax = (taxableIncome) => {
    let tax = 0;
    let slabs;

    if (formData.ageCategory === 'below60') {
      slabs = [250000, 500000, 1000000];
    } else if (formData.ageCategory === '60to80') {
      slabs = [300000, 500000, 1000000];
    } else {
      slabs = [500000, 1000000];
    }

    if (taxableIncome <= slabs[0]) {
      tax = 0;
    } else if (taxableIncome <= slabs[1]) {
      tax = (taxableIncome - slabs[0]) * 0.05;
    } else if (taxableIncome <= slabs[2]) {
      tax = (slabs[1] - slabs[0]) * 0.05 + (taxableIncome - slabs[1]) * 0.2;
    } else {
      tax = (slabs[1] - slabs[0]) * 0.05 + (slabs[2] - slabs[1]) * 0.2 + (taxableIncome - slabs[2]) * 0.3;
    }

    // Add health and education cess
    tax += tax * 0.04;

    return tax;
  };

  const calculateNewRegimeTax = (totalIncome) => {
    let tax = 0;
    const slabs = [250000, 500000, 750000, 1000000, 1250000, 1500000];

    if (totalIncome <= slabs[0]) {
      tax = 0;
    } else if (totalIncome <= slabs[1]) {
      tax = (totalIncome - slabs[0]) * 0.05;
    } else if (totalIncome <= slabs[2]) {
      tax = (slabs[1] - slabs[0]) * 0.05 + (totalIncome - slabs[1]) * 0.1;
    } else if (totalIncome <= slabs[3]) {
      tax = (slabs[1] - slabs[0]) * 0.05 + (slabs[2] - slabs[1]) * 0.1 + (totalIncome - slabs[2]) * 0.15;
    } else if (totalIncome <= slabs[4]) {
      tax = (slabs[1] - slabs[0]) * 0.05 + (slabs[2] - slabs[1]) * 0.1 + (slabs[3] - slabs[2]) * 0.15 + (totalIncome - slabs[3]) * 0.2;
    } else if (totalIncome <= slabs[5]) {
      tax = (slabs[1] - slabs[0]) * 0.05 + (slabs[2] - slabs[1]) * 0.1 + (slabs[3] - slabs[2]) * 0.15 + (slabs[4] - slabs[3]) * 0.2 + (totalIncome - slabs[4]) * 0.25;
    } else {
      tax = (slabs[1] - slabs[0]) * 0.05 + (slabs[2] - slabs[1]) * 0.1 + (slabs[3] - slabs[2]) * 0.15 + (slabs[4] - slabs[3]) * 0.2 + (slabs[5] - slabs[4]) * 0.25 + (totalIncome - slabs[5]) * 0.3;
    }

    // Add health and education cess
    tax += tax * 0.04;

    return tax;
  };

  const calculateHRAExemption = () => {
    const { basicSalary, da, hra, rentPaid, isMetroCity } = formData;
    const hraReceived = hra;
    const rentPaidOver10Percent = Math.max(rentPaid - 0.1 * (basicSalary + da), 0);
    const basicAndDa = basicSalary + da;
    const metroExemption = isMetroCity ? 0.5 * basicAndDa : 0.4 * basicAndDa;
    const hraExemption = Math.min(hraReceived, rentPaidOver10Percent, metroExemption);

    return hraExemption;
  };

  return (
    <div>
      <h1>Income Tax Calculator</h1>
      <div>
        <label htmlFor="assessmentYear">Assessment Year:</label>
        <select id="assessmentYear" name="assessmentYear" value={formData.assessmentYear} onChange={handleInputChange}>
          <option value="2023-2024">2023-2024</option>
          <option value="2022-2023">2022-2023</option>
        </select>
      </div>
      <div>
        <label htmlFor="ageCategory">Age Category:</label>
        <select id="ageCategory" name="ageCategory" value={formData.ageCategory} onChange={handleInputChange}>
          <option value="below60">Below 60</option>
          <option value="60to80">60 to 80</option>
          <option value="above80">Above 80</option>
        </select>
      </div>
      <div>
        <label htmlFor="grossSalary">Gross Salary:</label>
        <input id="grossSalary" type="number" name="grossSalary" value={formData.grossSalary} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="otherIncome">Other Income:</label>
        <input id="otherIncome" type="number" name="otherIncome" value={formData.otherIncome} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="interestIncome">Interest Income:</label>
        <input id="interestIncome" type="number" name="interestIncome" value={formData.interestIncome} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="rentalIncome">Rental Income:</label>
        <input id="rentalIncome" type="number" name="rentalIncome" value={formData.rentalIncome} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="selfOccupiedLoanInterest">Self-Occupied Loan Interest:</label>
        <input id="selfOccupiedLoanInterest" type="number" name="selfOccupiedLoanInterest" value={formData.selfOccupiedLoanInterest} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="letOutLoanInterest">Let-Out Loan Interest:</label>
        <input id="letOutLoanInterest" type="number" name="letOutLoanInterest" value={formData.letOutLoanInterest} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="section80C">Section 80C Deductions:</label>
        <input id="section80C" type="number" name="section80C" value={formData.section80C} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="nps80CCD">NPS 80CCD(1B):</label>
        <input id="nps80CCD" type="number" name="nps80CCD" value={formData.nps80CCD} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="medicalInsurance80D">Medical Insurance 80D:</label>
        <input id="medicalInsurance80D" type="number" name="medicalInsurance80D" value={formData.medicalInsurance80D} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="charity80G">Charity 80G:</label>
        <input id="charity80G" type="number" name="charity80G" value={formData.charity80G} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="educationLoan80E">Education Loan 80E:</label>
        <input id="educationLoan80E" type="number" name="educationLoan80E" value={formData.educationLoan80E} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="savingsInterest80TTA">Savings Interest 80TTA:</label>
        <input id="savingsInterest80TTA" type="number" name="savingsInterest80TTA" value={formData.savingsInterest80TTA} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="basicSalary">Basic Salary:</label>
        <input id="basicSalary" type="number" name="basicSalary" value={formData.basicSalary} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="da">DA:</label>
        <input id="da" type="number" name="da" value={formData.da} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="hra">HRA:</label>
        <input id="hra" type="number" name="hra" value={formData.hra} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="rentPaid">Rent Paid:</label>
        <input id="rentPaid" type="number" name="rentPaid" value={formData.rentPaid} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="isMetroCity">Is Metro City:</label>
        <input id="isMetroCity" type="checkbox" name="isMetroCity" checked={formData.isMetroCity} onChange={handleInputChange} />
      </div>
      <button onClick={calculateTax}>Calculate Tax</button>
      {taxResult && (
        <div>
          <h2>Tax Calculation Result</h2>
          <p>Total Income: {taxResult.totalIncome}</p>
          <p>Total Deductions: {taxResult.totalDeductions}</p>
          <p>Taxable Income: {taxResult.taxableIncome}</p>
          <p>Old Regime Tax: {taxResult.oldRegimeTax}</p>
          <p>New Regime Tax: {taxResult.newRegimeTax}</p>
          <p>HRA Exemption: {taxResult.hraExemption}</p>
        </div>
      )}
    </div>
  );
};

export default IncomeTaxCalculator;
