// src/components/WhatsAppShareButton.js
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppShareButton = ({ deal, className }) => {
  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `🛍️ Join our Group Buy Deal!\n\n` +
      `${deal.title}\n` +
      `${deal.description}\n\n` +
      `💰 Group Price: $${deal.price}\n` +
      `Original Price: $${deal.originalPrice}\n` +
      `🎉 ${Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF!\n\n` +
      `👥 ${deal.progress} people have joined\n` +
      `🎯 Only ${deal.target - deal.progress} spots left!\n\n` +
      `Join now: ${window.location.href}`
    );

    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={shareOnWhatsApp}
      className={className}
      aria-label="Share on WhatsApp"
    >
      <FaWhatsapp size={24} />
    </button>
  );
};

export default WhatsAppShareButton;