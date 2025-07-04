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
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex gap-4">
              <Link
                to="/recipes"
                className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                {t('hero.shareRecipe')}
              </Link>
              <Link
                to="/recipes"
                className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:shadow-md transition-all border border-gray-200"
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