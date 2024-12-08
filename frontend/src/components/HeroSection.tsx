import { ChefHat, UtensilsCrossed } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white space-y-8">
            <div className="flex items-center gap-4 text-yellow-400">
              <ChefHat size={32} />
              <UtensilsCrossed size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Discover the Art of 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {" "}Cooking
              </span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Explore a world of flavors, share your culinary masterpieces, and join our community of food enthusiasts.
            </p>
            <div className="flex gap-4">
              <Link
                to="/recipes"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Share Your Recipe
              </Link>
              <Link
                to="/recipes"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all"
              >
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;