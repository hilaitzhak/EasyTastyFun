import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WheatOff, Sparkles } from 'lucide-react';
import { categoryApi } from '../api/category.api';
import { IRecipe } from '../interfaces/Recipe';
import { Category, SubCategory } from '../interfaces/Category';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import Pagination from '../components/Pagination';
import { ChevronRight, UtensilsCrossed } from 'lucide-react';

// Icon + tagline for the cross-cutting "special" categories (dietary / holiday)
const SPECIAL_CATEGORY_META: Record<string, { icon: typeof WheatOff; taglineKey: string }> = {
  'nav.glutenFree': { icon: WheatOff, taglineKey: 'categoryTagline.glutenFree' },
  'nav.passover': { icon: Sparkles, taglineKey: 'categoryTagline.passover' },
};

function RecipePage() {
  const ITEMS_PER_PAGE = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const { categoryPath = '', subCategoryPath = '' } = useParams<{ categoryPath: string; subCategoryPath?: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch subcategories for the filter chips whenever the category changes
  useEffect(() => {
    if (!categoryPath) return;
    categoryApi.getSubCategoriesByCategory(categoryPath)
      .then((data: SubCategory[]) => setSubCategories(data || []))
      .catch(() => setSubCategories([]));
  }, [categoryPath]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (subCategoryPath) {
          const sub = await categoryApi.getSubCategoryByPath(categoryPath, subCategoryPath);
          if (sub) {
            setSubCategory(sub);
            const { recipes, pagination } = await categoryApi.getRecipesByCategoryAndSubcategory(
              categoryPath,
              subCategoryPath,
              currentPage,
              ITEMS_PER_PAGE
            );
            setRecipes(recipes || []);
            setTotalRecipes(pagination?.totalRecipes ?? 0);
            const cat = await categoryApi.getCategoryByPath(categoryPath);
            setCategory(cat);
          }
        } else {
          const cat = await categoryApi.getCategoryByPath(categoryPath);
          if (cat) {
            setCategory(cat);
            const { recipes, pagination } = await categoryApi.getRecipesByCategoryPath(
              categoryPath,
              currentPage,
              ITEMS_PER_PAGE
            );
            setRecipes(recipes || []);
            setTotalRecipes(pagination?.totalRecipes ?? 0);
          }
          setSubCategory(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryPath, subCategoryPath, currentPage]);

  const totalPages = Math.ceil(totalRecipes / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryPath, subCategoryPath]);

  const handleSubCategoryClick = (sub: SubCategory | null) => {
    if (sub === null) {
      navigate(`/categories/${categoryPath}`);
    } else {
      navigate(`/categories/${categoryPath}/${sub.path}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <div className="h-56 md:h-72 bg-terracotta-light animate-pulse" />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">

      {/* ── Hero ─────────────────────────────────── */}
      {recipes.length > 0 && recipes[0].images?.[0]?.link ? (
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img
            src={recipes[0].images[0].link}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                {subCategory ? t(subCategory.nameKey) : category ? t(category.nameKey) : ''}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-terracotta-light border-b border-line px-6 py-10">
          <div className="max-w-6xl mx-auto flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-terracotta flex items-center justify-center shadow-md flex-shrink-0">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
              {subCategory ? t(subCategory.nameKey) : category ? t(category.nameKey) : ''}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Breadcrumb ───────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-sm text-ink-soft">
          <a href="/" className="hover:text-terracotta-dark transition-colors">{t('nav.home')}</a>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
              <a
                href={`/categories/${category.path}`}
                className="hover:text-terracotta-dark transition-colors"
              >
                {t(category.nameKey)}
              </a>
            </>
          )}
          {subCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-ink font-medium">{t(subCategory.nameKey)}</span>
            </>
          )}
        </nav>

        {/* ── Subcategory filter chips ─────────────── */}
        {subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSubCategoryClick(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                !subCategoryPath
                  ? 'bg-terracotta text-white border-transparent shadow-sm'
                  : 'bg-surface border-line text-ink-soft hover:border-terracotta hover:text-terracotta'
              }`}
            >
              {t('nav.all')}
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubCategoryClick(sub)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  subCategoryPath === sub.path
                    ? 'bg-terracotta text-white border-transparent shadow-sm'
                    : 'bg-surface border-line text-ink-soft hover:border-terracotta hover:text-terracotta'
                }`}
              >
                {t(sub.nameKey)}
              </button>
            ))}
          </div>
        )}

        {/* ── Count ────────────────────────────────── */}
        <p className="text-sm text-ink-soft">
          {t('recipe.foundCount', { count: recipes.length })}
        </p>

        {/* Special category header (dietary / holiday) */}
        {(() => {
          const special = category ? SPECIAL_CATEGORY_META[category.nameKey] : undefined;
          if (!special) return null;
          const SpecialIcon = special.icon;
          return (
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta-light text-terracotta-dark shadow-soft shrink-0">
                <SpecialIcon className="w-6 h-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
                  {subCategory ? t(subCategory.nameKey) : category ? t(category.nameKey) : ''}
                </h2>
                <p className="text-ink-soft max-w-xl">
                  {t(special.taglineKey)}
                </p>
              </div>
            </div>
          );
        })()}

        {/* ── Recipe Grid ──────────────────────────── */}
        {recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.recipeId} recipe={recipe} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-terracotta-light flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-8 h-8 text-olive" />
            </div>
            <h2 className="font-display text-xl font-semibold text-ink mb-2">{t('recipe.noRecipesFound')}</h2>
            <p className="text-ink-soft text-sm">{t('recipe.tryDifferentCategory')}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default RecipePage;
