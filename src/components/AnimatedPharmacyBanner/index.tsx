import React from 'react';
import './style.scss';

const AnimatedPharmacyBanner: React.FC = () => {
  return (
    <div className="animated-pharmacy-banner bg-gradient-to-r from-pink-400 to-purple-800 rounded-lg p-4" aria-hidden={false}>
      <h1 className="banner-title" data-heading="MediMix Pharmacy">MediMix Pharmacy</h1>
    </div>
  );
};

export default AnimatedPharmacyBanner;
