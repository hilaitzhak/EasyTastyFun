import { ChefHat, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function HeroSection() {
  const { t } = useTranslation();
  return (
    <div className="relative h-[560px] overflow-hidden bg-gradient-to-br from-primary-50 via-surface-muted to-accent-50">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl space-y-7 animate-fade-up">
          {/* Icons */}
          <div className="flex items-center gap-3 text-primary-500">
            <ChefHat size={28} strokeWidth={1.5} />
            <UtensilsCrossed size={28} strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-800">
            {t('hero.discoverTitle')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              {t('hero.cookingTitle')}
            </span>
          </h1>

          {/* Subtitle decoration */}
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />

          {/* CTA */}
          <div className="flex gap-4 pt-2">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-400 to-pink-400 shadow-sm hover:shadow-md hover:from-orange-500 hover:to-pink-500 transition-all duration-200"
            >
              {t('hero.browseRecipes')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
