import { useContext, useEffect, useRef, useState } from 'react';
import { Globe, Menu, X, ChevronDown, UserCircle, LogOut, Home, Search, WheatOff, Sparkles, Heart, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';
import { AuthContext } from '../context/AuthContext';

// Cross-cutting "special" categories (dietary / holiday) shown as a distinct group in the nav
const SPECIAL_CATEGORY_KEYS = ['nav.glutenFree', 'nav.passover'];
const SPECIAL_CATEGORY_ICONS: Record<string, typeof WheatOff> = {
  'nav.glutenFree': WheatOff,
  'nav.passover': Sparkles,
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
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

  // Regular categories collapse into the "Categories" mega-menu; specials stay inline
  const regularCategories = categories.filter((c) => !SPECIAL_CATEGORY_KEYS.includes(c.nameKey));
  const specialCategories = categories.filter((c) => SPECIAL_CATEGORY_KEYS.includes(c.nameKey));

  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
<nav className="fixed top-0 left-0 w-full z-50 bg-paper/90 border-b border-line backdrop-blur-md">
      <div className="max-w-8xl mx-auto px-6 w-full">
        <div className="flex justify-between items-center h-16">
          {/* Brand wordmark */}
          <Link to="/" className="flex items-center shrink-0 mr-6">
            <span className="font-display text-2xl font-bold tracking-tight text-ink">
              Easy<span className="text-terracotta">Tasty</span>Fun
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="flex items-center font-bold text-ink-soft text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:bg-terracotta-light hover:text-terracotta-dark"
            >
              <Home className="w-4 h-4 text-terracotta" />
              <span className="font-display font-bold text-terracotta text-base tracking-tight">EasyTastyFun</span>
            </Link>
            <Link
              to="/recipes"
              className="flex items-center font-bold text-ink-soft text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:bg-terracotta-light hover:text-terracotta-dark whitespace-nowrap"
            >
              {t('nav.allRecipes')}
            </Link>
            <Link
              to="/what-can-i-cook"
              className="flex items-center gap-1.5 font-medium text-ink-soft text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:bg-terracotta-light hover:text-terracotta-dark whitespace-nowrap"
            >
              <ChefHat className="w-4 h-4 text-terracotta" />
              {t('nav.whatCanICook')}
            </Link>
            <Link
              to="/favorites"
              className="flex items-center gap-1.5 font-medium text-ink-soft text-sm px-3 py-2 rounded-md transition-colors duration-200 hover:bg-terracotta-light hover:text-terracotta-dark whitespace-nowrap"
            >
              <Heart className="w-4 h-4 text-terracotta" />
              {t('nav.favorites')}
            </Link>

            {/* Categories mega-menu (all categories, including dietary/holiday specials) */}
            {categories.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setActiveCategory('__categories__')}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button
                  className="flex items-center font-medium text-sm px-3 py-2 rounded-md text-ink-soft transition-colors duration-200 hover:bg-terracotta-light hover:text-terracotta-dark whitespace-nowrap"
                >
                  <span>{t('nav.categories')}</span>
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeCategory === '__categories__' ? 'rotate-180' : ''}`} />
                </button>

                {activeCategory === '__categories__' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                    <div className="bg-surface rounded-2xl shadow-card border border-line p-6 w-[52rem] max-w-[92vw] max-h-[78vh] overflow-y-auto columns-2 md:columns-3 xl:columns-4 gap-x-8">
                      {[...regularCategories, ...specialCategories].map((category) => {
                        const SpecialIcon = SPECIAL_CATEGORY_ICONS[category.nameKey];
                        return (
                          <div key={category.id} className="mb-5 break-inside-avoid">
                            <Link
                              to={category.path}
                              onClick={() => setActiveCategory(null)}
                              className={`flex items-center gap-1.5 font-display font-semibold text-sm hover:text-terracotta-dark mb-1.5 pb-1.5 border-b border-line ${SpecialIcon ? 'text-terracotta-dark' : 'text-ink'}`}
                            >
                              {SpecialIcon && <SpecialIcon className="w-4 h-4 shrink-0" />}
                              {t(`${category.nameKey}`)}
                            </Link>
                            {category.subCategories && category.subCategories.length > 0 && (
                              <ul>
                                {category.subCategories.map((subCategory: SubCategory) => (
                                  <li key={subCategory.id}>
                                    <Link
                                      to={subCategory.path}
                                      onClick={() => setActiveCategory(null)}
                                      className="block text-[13px] text-ink-soft hover:text-terracotta-dark py-0.5 leading-snug"
                                    >
                                      {t(`${subCategory.nameKey}`)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="flex items-center">
              {isSearchOpen ? (
                <form onSubmit={submitSearch} className="flex items-center gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('allRecipes.searchPlaceholder')}
                    className="w-44 px-3 py-1.5 text-sm rounded-full border border-line focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent bg-surface"
                    onBlur={() => { if (!searchQuery) setIsSearchOpen(false); }}
                    onKeyDown={(e) => { if (e.key === 'Escape') { setIsSearchOpen(false); setSearchQuery(''); } }}
                  />
                  <button type="submit" className="p-2 rounded-full hover:bg-terracotta-light text-ink-soft">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={openSearch}
                  className="flex items-center gap-2 text-ink-soft px-3 py-2 rounded-full transition-colors duration-200 hover:bg-terracotta-light hover:text-terracotta-dark"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-ink-soft px-4 py-2 rounded-full transition-colors duration-200 hover:bg-terracotta-light hover:text-terracotta-dark"
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
                  className="flex items-center gap-2 text-ink-soft px-4 py-2 rounded-full transition-colors duration-200 hover:bg-terracotta-light hover:text-terracotta-dark"
                >
                  <UserCircle className="w-6 h-6" />
                  <span className="text-xs font-medium">
                    {auth?.user.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-surface rounded-xl shadow-card py-2 z-50 border border-line`}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-ink-soft hover:bg-terracotta-light hover:text-terracotta-dark transition-colors"
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
              className="md:hidden p-2 rounded-md transition-colors duration-200 hover:bg-terracotta-light text-ink-soft"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0 overflow-hidden'}`}>
          <div className="py-4 space-y-2">
            <Link
              to="/recipes"
              className="block py-2 px-4 text-ink-soft hover:bg-terracotta-light hover:text-terracotta-dark rounded-lg transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.allRecipes')}
            </Link>
            <Link
              to="/what-can-i-cook"
              className="flex items-center gap-2 py-2 px-4 text-ink-soft hover:bg-terracotta-light hover:text-terracotta-dark rounded-lg transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <ChefHat className="w-4 h-4 text-terracotta" />
              {t('nav.whatCanICook')}
            </Link>
            <Link
              to="/favorites"
              className="flex items-center gap-2 py-2 px-4 text-ink-soft hover:bg-terracotta-light hover:text-terracotta-dark rounded-lg transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="w-4 h-4 text-terracotta" />
              {t('nav.favorites')}
            </Link>
            {categories.map((category) => {
              const SpecialIcon = SPECIAL_CATEGORY_ICONS[category.nameKey];
              return (
              <div key={category.id} className="space-y-1">
                <Link
                  to={category.path}
                  className={`flex items-center gap-2 py-2 px-4 hover:bg-terracotta-light hover:text-terracotta-dark rounded-lg transition-colors duration-200 ${SpecialIcon ? 'text-terracotta-dark font-medium' : 'text-ink-soft'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {SpecialIcon && <SpecialIcon className="w-4 h-4" />}
                  {t(`${category.nameKey}`)}
                </Link>
                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="pl-4 space-y-1 border-l border-line">
                    {category.subCategories.map((subCategory: SubCategory) => (
                      <Link
                        key={subCategory.id}
                        to={subCategory.path}
                        className="block py-2 px-4 text-ink-muted hover:bg-terracotta-light hover:text-terracotta-dark rounded-lg transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {t(`${subCategory.nameKey}`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              );
            })}
            {auth?.user && (
              <div className="border-t border-line mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full py-2 px-4 text-ink-soft hover:bg-terracotta-light hover:text-terracotta-dark rounded-lg transition-colors duration-200"
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