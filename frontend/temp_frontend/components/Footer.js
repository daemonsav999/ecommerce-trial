// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 text-center py-4 mt-4">
      <p>© {new Date().getFullYear()} DealMitra. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
