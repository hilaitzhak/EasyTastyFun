
import React, { useState, useEffect, useContext, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiErrorKey } from '../utils/apiError';
import { recipeApi } from '../api/recipe.api';
import { useTranslation } from 'react-i18next';
import { IngredientGroup, InstructionGroup, RecipeImage } from '../interfaces/Recipe';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';
import RecipeForm from '../components/RecipeForm';
import UnsavedChangesPrompt from '../components/UnsavedChangesPrompt';
import { AuthContext } from '../context/AuthContext';

const EditRecipe = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isRTL = i18n.language === 'he';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [images, setImages] = useState<RecipeImage[]>([]);
  const [video, setVideo] = useState<{ id?: string; link: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);
  const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>([]);
  const [instructionGroups, setInstructionGroups] = useState<InstructionGroup[]>([]);
  const [tips, setTips] = useState<string[]>(['']);
  const [isDirty, setIsDirty] = useState(false);
  const auth = useContext(AuthContext);

  // Mark dirty when editable fields change — but only after the recipe has been
  // hydrated, so loading the existing data doesn't count as a user edit.
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) return;
    setIsDirty(true);
  }, [images, ingredientGroups, instructionGroups, tips, selectedCategory, selectedSubCategory]);

  // Allow dirty tracking once the initial load render has settled.
  useEffect(() => {
    if (!recipe) return;
    const id = setTimeout(() => { hydrated.current = true; }, 0);
    return () => clearTimeout(id);
  }, [recipe]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeApi.getRecipeById(id!);
        const recipeData = response.data;
        setRecipe(recipeData);
        setIngredientGroups(
          recipeData.ingredientGroups.map((group: IngredientGroup) => ({
            title: group.title,
            ingredients: group.ingredients,
          }))
        );
        setInstructionGroups(
          recipeData.instructionGroups.map((group: InstructionGroup) => ({
            title: group.title,
            instructions: group.instructions,
          }))
        );
        setImages(recipeData.images.map((img: any) => ({ 
          id: img.id,
          data: img.link,
          link: img.link,
          file: new File([], "placeholder")
        })));
        
        setVideo(recipeData.video ? {
          id: recipeData.video.id,
          link: recipeData.video.link
        } : null);
        setSelectedCategory(recipeData.category);
        setSelectedSubCategory(recipeData.subcategory);
        setTips(recipeData.tips || []);
      } catch (error: any) {
        console.error('Error fetching recipe:', error);
        toast.error(t(getApiErrorKey(error)));
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate, t]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoryData } = await categoryApi.getCategories();
        setCategories(categoryData);
        const subcategoryData = await categoryApi.getAllSubCategories();
        setSubcategories(subcategoryData);
      } catch (error) {
        console.error('Error fetching categories or subcategories:', error);
      }
    };
    fetchData();
  }, []);
      
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(sub => sub.categoryId === selectedCategory);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories, recipe]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory('');
    setIsDirty(true);
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
  
    try {
      const formData = new FormData(e.currentTarget);
      const processedImages = images.map(img => {
        if (img.data && img.data.includes('amazonaws.com')) {
          return {
            id: img.id || crypto.randomUUID(),
            link: img.data
          };
        }
        else if (img.data && img.data.startsWith('data:')) {
          return {
            data: img.data
          };
        }
        else if (img.link) {
          return {
            id: img.id,
            link: img.link
          };
        }
        return img;
      });
      
      let processedVideo = null;
      if (video) {
        if (video.link && video.link.startsWith('data:')) {
          processedVideo = { link: video.link };
        }
        else if (video.link && video.link.includes('amazonaws.com')) {
          processedVideo = { 
            id: video.id || crypto.randomUUID(), 
            link: video.link 
          };
        }
      }

      const updatedRecipe = {
        name: formData.get('name'),
        prepTime: Number(formData.get('prepTime')),
        cookTime: Number(formData.get('cookTime')),
        servings: Number(formData.get('servings')),
        category: selectedCategory,
        subcategory: selectedSubCategory,
        ingredientGroups,
        instructionGroups,
        images: processedImages,
        video: processedVideo,
        tips: tips.filter(tip => tip.trim())
      };

      await recipeApi.update(id!, updatedRecipe, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      toast.success(t('editRecipe.updateSuccess'));
      // Clear the dirty flag synchronously so the success navigation isn't
      // intercepted by the unsaved-changes prompt.
      flushSync(() => setIsDirty(false));
      navigate(`/recipe/${id}`);
    } catch (error: any) {
      console.error('Error updating recipe:', error);
      toast.error(t(getApiErrorKey(error)));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/recipe/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-line"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-terracotta border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-terracotta font-medium animate-pulse">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <UnsavedChangesPrompt when={isDirty} />
      {/* Modern Header with Glass Effect */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-surface border-b border-line shadow-soft">
        <div className="max-w-8xl mx-auto px-6 w-full py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/recipe/${id}`)}
                  className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-surface hover:bg-terracotta-light shadow-soft hover:shadow-card transition-all duration-200 border border-line"
                >
                  {isRTL ? (
                    <ArrowRight className="w-5 h-5 text-terracotta group-hover:translate-x-1 transition-transform duration-200" />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-terracotta group-hover:-translate-x-1 transition-transform duration-200" />
                  )}
                  <span className="font-medium text-ink">{t('editRecipe.backToRecipe')}</span>
                </button>

                <div className="hidden sm:block w-px h-8 bg-line"></div>

                <div className="flex items-center space-x-3 gap-4">
                  <div className="p-2 rounded-xl bg-terracotta shadow-card">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-terracotta">
                      {t('editRecipe.title')}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 w-full py-8">
        <div className="max-w-7xl mx-auto">
          {/* Modern Card Container */}
          <div className="bg-surface backdrop-blur-sm rounded-3xl shadow-card border border-line overflow-hidden">
            <div className="p-8">
              <RecipeForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={saving}
                isEdit={true}
                initialData={recipe}
                ingredientGroups={ingredientGroups}
                setIngredientGroups={setIngredientGroups}
                instructionGroups={instructionGroups}
                setInstructionGroups={setInstructionGroups}
                images={images}
                setImages={setImages}
                categories={categories}
                subcategories={filteredSubcategories}
                onCategoryChange={handleCategoryChange}
                onSubCategoryChange={handleSubCategoryChange}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                tips={tips}
                setTips={setTips}
                video={video}
                setVideo={setVideo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
