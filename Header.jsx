import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">THE TAX</div>
      <div className="search-bar">
        <input type="text" placeholder="What are you looking for today?" />
      </div>
      <button className="contact-btn">CONTACT US</button>
    </header>
  );
};

export default Header;
