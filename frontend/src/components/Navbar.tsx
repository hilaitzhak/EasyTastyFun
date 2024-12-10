import { Globe, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const categories = [
  { nameKey: 'nav.allRecipes', path: '/recipes' },
  { nameKey: 'nav.cakes', path: '/category/cakes' },
  { nameKey: 'nav.desserts', path: '/category/desserts' },
  { nameKey: 'nav.hotStews', path: '/category/stews' },
  { nameKey: 'nav.pasta', path: '/category/pasta' },
  { nameKey: 'nav.salads', path: '/category/salads' },
  { nameKey: 'nav.breakfast', path: '/category/breakfast' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // const toggleLanguage = () => {
  //   const newLang = i18n.language === 'en' ? 'he' : 'en';
  //   i18n.changeLanguage(newLang);
  //   document.dir = newLang === 'he' ? 'rtl' : 'ltr';
  // };

  useEffect(() => {
    document.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, []); // Run once on mount

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };
  
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="hidden md:flex space-x-6">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-white/90 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/10"
              >
                {t(category.nameKey)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/10"
            >
              <Globe className="w-5 h-5" />
              <span>{i18n.language === 'en' ? 'עברית' : 'English'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-6">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="block py-2 px-4 text-white/90 hover:bg-white/10 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {t(category.nameKey)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;