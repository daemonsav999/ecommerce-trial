// src/components/HeroBanner.js
import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative w-full h-60 bg-cover bg-center bg-[url('/banner.jpg')] flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" />
      <h1 className="text-white text-3xl md:text-5xl font-bold z-10">
        Big Deals Await!
      </h1>
    </div>
  );
};

export default HeroBanner;
