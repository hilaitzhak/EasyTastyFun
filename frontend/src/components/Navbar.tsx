import React, { useEffect, useState } from 'react';
import { Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const { data } = await categoryApi.getCategories();
      console.log("Fetched categories:", data); // Log the data
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  const renderSubCategories = (subCategories: SubCategory[]) => {
    return (
      <div className="grid grid-cols-3 gap-4 p-6 bg-white text-gray-700 rounded-lg shadow-lg">
        {subCategories.map((subCategory) => (
          <Link
            key={subCategory._id}
            to={subCategory.path}
            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            {t(`${subCategory.nameKey}`)}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="hidden md:flex space-x-8 relative">
            {categories.length > 0 && categories.map((category) => (
              <div
                key={category._id}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category._id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to={category.path}
                  className="flex items-center text-white hover:text-white/80 transition-colors px-4 py-2 rounded-full hover:bg-white/10"
                >
                  {t(`${category.nameKey}`)}
                  {category.subCategories && category.subCategories.length > 0 && (
                    <ChevronDown className="ml-1 w-4 h-4" />
                  )}
                </Link>

                {category.subCategories && category.subCategories.length > 0 && activeCategory === category._id && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-max z-50">
                    {renderSubCategories(category.subCategories)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Language and Mobile Menu Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors px-3 py-2 rounded-full hover:bg-white/10"
            >
              <Globe className="w-5 h-5" />
              <span>{i18n.language === 'en' ? 'עברית' : 'English'}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6">
            {categories.map((category) => (
              <div key={category._id} className="mb-2">
                <Link
                  to={category.path}
                  className="block py-2 px-4 text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t(`nav.${category.nameKey}`)}
                </Link>
                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="pl-4">
                    {category.subCategories.map((subCategory) => (
                      <Link
                        key={subCategory._id}
                        to={subCategory.path}
                        className="block py-1 px-4 text-white/80 hover:bg-white/10 rounded-lg"
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;