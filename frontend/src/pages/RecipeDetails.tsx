import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeApi.getById(id!);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipeApi.delete(id!);
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  const nextImage = () => {
    if (recipe?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === recipe.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (recipe?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? recipe.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe not found</h2>
          <button
            onClick={() => navigate('/recipes')}
            className="text-purple-600 hover:text-purple-700"
          >
            Back to recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Navigation and Actions */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/recipes')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Recipes
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/recipe/edit/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Recipe Title and Meta */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.name}</h1>
          
          <div className="flex gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{recipe.prepTime + recipe.cookTime} mins</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          {/* Image Gallery */}
          {recipe.images && recipe.images.length > 0 && (
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img
                  src={recipe.images[currentImageIndex].data}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {recipe.images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient: any, index: number) => (
                <li key={index} className="flex justify-between items-center border-b border-gray-100 py-2">
                  <span className="text-gray-800">{ingredient.name}</span>
                  <span className="text-gray-600">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction: string, index: number) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;