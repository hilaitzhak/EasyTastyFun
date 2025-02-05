import React, { useEffect, useState } from 'react';
import { Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  // useEffect(() => {
  //   fetchCategories();
  // }, []);
  
  // const fetchCategories = async () => {
  //   try {
  //     const { data } = await categoryApi.getCategories();
  //     setCategories(data);
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //   }
  // };

  // Function to get cached categories
  const getCachedCategories = () => {
    const cached = localStorage.getItem('categories');
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  };

  const setCachedCategories = (data: Category[]) => {
    localStorage.setItem('categories', JSON.stringify(data));
  };

  const fetchCategories = async () => {
    try {
      const cachedData = getCachedCategories();
      if (cachedData) {
        setCategories(cachedData);
      }

      const { data } = await categoryApi.getCategories();
      setCategories(data);
      setCachedCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // If fetch fails, use cached data as fallback
      const cachedData = getCachedCategories();
      if (cachedData) {
        setCategories(cachedData);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 shadow-lg backdrop-blur-sm bg-opacity-90 w-full">
      <div className="container mx-auto px-6 w-full">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/recipes"
              className="flex items-center text-white px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/15 hover:scale-105"
            >
              {t('nav.allRecipes')}
            </Link>
            
            {categories.length > 0 && categories.map((category) => (
              <div
                key={category._id}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category._id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to={category.path}
                  className="flex items-center text-white px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/15 hover:scale-105"
                >
                  <span>{t(`${category.nameKey}`)}</span>
                  {category.subCategories && category.subCategories.length > 0 && (
                    <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180 duration-200" />
                  )}
                </Link>

                {category.subCategories && category.subCategories.length > 0 && activeCategory === category._id && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-max z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                      <div className="grid grid-cols-2 gap-2">
                        {category.subCategories.map((subCategory: SubCategory) => (
                          <Link
                            key={subCategory._id}
                            to={subCategory.path}
                            className="px-4 py-3 text-gray-700 hover:text-purple-600 rounded-xl transition-all duration-200 hover:bg-purple-50 whitespace-nowrap"
                          >
                            {t(`${subCategory.nameKey}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/15 hover:scale-105"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                {i18n.language === 'en' ? 'עברית' : 'English'}
              </span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full transition-all duration-200 hover:bg-white/15"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - with smooth transition */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="py-4 space-y-2">
            <Link
              to="/recipes"
              className="block py-2 px-4 text-white hover:bg-white/15 rounded-xl transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.allRecipes')}
            </Link>
            {categories.map((category) => (
              <div key={category._id} className="space-y-1">
                <Link
                  to={category.path}
                  className="block py-2 px-4 text-white hover:bg-white/15 rounded-xl transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t(`${category.nameKey}`)}
                </Link>
                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="pl-4 space-y-1 border-l border-white/20">
                    {category.subCategories.map((subCategory: SubCategory) => (
                      <Link
                        key={subCategory._id}
                        to={subCategory.path}
                        className="block py-2 px-4 text-white/80 hover:bg-white/15 rounded-xl transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {t(`${subCategory.nameKey}`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;