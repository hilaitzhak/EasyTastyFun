import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import LatestRecipes from './LatestRecipes';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <LatestRecipes />
    </div>
  );
};

export default HomePage;