import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { IngredientGroup, InstructionGroup, RecipeImage } from '../interfaces/Recipe';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';
import RecipeForm from '../components/RecipeForm';
import { AuthContext } from '../context/AuthContext';

const EditRecipe = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    // Reset subcategory when category changes
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
        // If image is a URL from S3 (existing image)
        if (img.data && img.data.includes('amazonaws.com')) {
          return {
            id: img.id || crypto.randomUUID(),
            link: img.data
          };
        }
        // If it's a new image with base64 data
        else if (img.data && img.data.startsWith('data:')) {
          return {
            data: img.data // Send only data for new images
          };
        }
        // For images that already have the right structure
        else if (img.link) {
          return {
            id: img.id,
            link: img.link
          };
        }
        // Fallback case
        return img;
      });
      
      let processedVideo = null;
      if (video) {
        // If it's a new video with base64 data
        if (video.link && video.link.startsWith('data:')) {
          processedVideo = { link: video.link };
        }
        // If it's an existing video from S3
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
      console.log('Updated Recipe:', updatedRecipe);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(`/recipe/${id}`)}
                className="group flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                { isRTL ? (<ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />) : 
                  (<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />) }
                <span className="font-medium">{t('editRecipe.backToRecipe')}</span>
              </button>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">
                {t('editRecipe.title')}
              </h1>
            </div>
          </div>

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
  );
};

export default EditRecipe;