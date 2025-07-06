import { ChefHat, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function HeroSection() {
  const { t } = useTranslation();
  return (
    <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/60 to-pink-100/60">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-gray-800 space-y-8">
            <div className="flex items-center gap-4 text-orange-500">
              <ChefHat size={32} />
              <UtensilsCrossed size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-700">
              {t('hero.discoverTitle')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                {" "}{t('hero.cookingTitle')}
              </span>
            </h1>
            <div className="flex gap-4">
              <Link
                to="/recipes"
                className="bg-gradient-to-r from-orange-500 to-pink-500 
                text-white px-4 py-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 rounded-full hover:from-orange-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-md hover:shadow-lg
                hover:from-orange-600 hover:to-pink-600 
                transition-transform shadow 
                disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center gap-2 min-w-[150px] text-md font-semibold"
              >
                {t('hero.browseRecipes')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;