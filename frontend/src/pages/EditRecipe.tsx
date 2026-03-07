
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChefHat } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';
import { useTranslation } from 'react-i18next';
import { IngredientGroup, InstructionGroup, RecipeImage } from '../interfaces/Recipe';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';
import RecipeForm from '../components/RecipeForm';
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
  const auth = useContext(AuthContext);

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
      } catch (error) {
        console.error('Error fetching recipe:', error);
        alert(t('editRecipe.loadError'));
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
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
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
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/recipe/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-sm">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {t('editRecipe.title')}
              </h1>
            </div>
            <button
              onClick={() => navigate(`/recipe/${id}`)}
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
            >
              {isRTL ? (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              )}
              <span>{t('editRecipe.backToRecipe')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
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
  );
};

export default EditRecipe;