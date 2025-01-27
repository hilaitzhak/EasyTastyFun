import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LatestRecipes from '../components/LatestRecipes';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <LatestRecipes />
    </div>
  );
};

export default HomePage;