import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LatestRecipes from '../components/LatestRecipes';

function HomePage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-pink-50/30">
      <HeroSection />
      <LatestRecipes />
    </div>
  );
};

export default HomePage;