import React from 'react';

const Banner = () => {
  return (
    <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: "url('/banner.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Big Deals Await!</h1>
      </div>
    </div>
  );
};

export default Banner;
