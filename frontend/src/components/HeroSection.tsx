import { ChefHat, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function HeroSection() {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-butter-light via-paper to-terracotta-light border-b border-line">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-terracotta-light/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-butter-light/30 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl space-y-8 animate-fade-up">
          {/* Icons */}
          <div className="flex items-center gap-3 text-terracotta">
            <ChefHat size={28} strokeWidth={1.5} />
            <UtensilsCrossed size={28} strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
              EasyTastyFun
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] text-ink">
            {t('hero.discoverTitle')}
            <span className="block text-terracotta">
              {t('hero.cookingTitle')}
            </span>
          </h1>

          {/* Subtitle decoration */}
          <div className="w-16 h-1 rounded-full bg-terracotta" />

          {/* CTA */}
          <div className="flex gap-4 pt-2">
            <Link
              to="/recipes"
              className="inline-flex items-center justify-center gap-2 min-w-[150px]
                bg-terracotta text-white px-7 py-3.5 rounded-full text-sm font-medium tracking-wide
                transition-colors duration-200 hover:bg-terracotta-dark
                disabled:opacity-50 disabled:cursor-not-allowed"
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
