import { useContext, useEffect, useState } from 'react';
import { Globe, Menu, X, ChevronDown, UserCircle, LogOut, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const auth = useContext(AuthContext);
  const isRTL = i18n.language === 'he';
  const navigate = useNavigate();

  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const handleLogout = () => {
    sessionStorage.removeItem('categories');
    sessionStorage.removeItem('recipes_cache');
    // sessionStorage.removeItem('i18nextLng');
  
    // Perform logout
    auth?.logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  // Function to get cached categories
  const getCachedCategories = () => {
    const cached = sessionStorage.getItem('categories');
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  };

  const setCachedCategories = (data: Category[]) => {
    sessionStorage.setItem('categories', JSON.stringify(data));
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
<nav className="fixed top-0 left-0 w-full z-50 bg-white/95 shadow-sm border-b border-gray-100 backdrop-blur-md">
      <div className="max-w-8xl mx-auto px-6 w-full">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="flex items-center font-bold text-gray-600 text-sm px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 hover:scale-105"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link
              to="/recipes"
              className="flex items-center font-bold text-gray-600 text-sm px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 hover:scale-105"
            >
              {t('nav.allRecipes')}
            </Link>
            
            {categories.length > 0 && categories.map((category) => (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to={category.path}
                  className="flex items-center text-gray-600 font-bold text-sm px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 hover:scale-105"
                >
                  <span>{t(`${category.nameKey}`)}</span>
                  {category.subCategories && category.subCategories.length > 0 && (
                    <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180 duration-200" />
                  )}
                </Link>

                {category.subCategories && category.subCategories.length > 0 && activeCategory === category.id && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-max z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                      <div className="grid grid-cols-3 gap-1">
                        {category.subCategories.map((subCategory: SubCategory) => (
                          <Link
                            key={subCategory.id}
                            to={subCategory.path}
                            className="px-4 py-3 text-gray-600 text-xs hover:text-orange-500 rounded-xl transition-all duration-200 hover:bg-orange-50 whitespace-nowrap"
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
              className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 hover:scale-105"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-medium">
                {i18n.language === 'en' ? 'עברית' : 'English'}
              </span>
            </button>

            {/* Profile Menu */}
            {auth?.user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 hover:scale-105"
                >
                  <UserCircle className="w-6 h-6" />
                  <span className="text-xs font-medium">
                    {auth?.user.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100`}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('auth.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full transition-all duration-200 hover:bg-gray-50 text-gray-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="py-4 space-y-2">
            <Link
              to="/recipes"
              className="block py-2 px-4 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.allRecipes')}
            </Link>
            {categories.map((category) => (
              <div key={category.id} className="space-y-1">
                <Link
                  to={category.path}
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t(`${category.nameKey}`)}
                </Link>
                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="pl-4 space-y-1 border-l border-gray-200">
                    {category.subCategories.map((subCategory: SubCategory) => (
                      <Link
                        key={subCategory.id}
                        to={subCategory.path}
                        className="block py-2 px-4 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {t(`${subCategory.nameKey}`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {auth?.user && (
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full py-2 px-4 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;