import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader, ArrowLeft } from 'lucide-react';
import { IRecipe } from '../interfaces/Recipe';
import { recipeApi } from '../api/recipe.api';
import { RecipeCard } from '../components/RecipeCard';


const AllRecipes = () => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const { data } = await recipeApi.getAll();
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors p-2 rounded-lg hover:bg-purple-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">All Recipes</h1>
          <p className="text-gray-600 mb-8">Discover our complete collection of amazing recipes</p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-12"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex items-center gap-3 text-purple-600">
              <Loader className="w-6 h-6 animate-spin" />
              <span className="text-lg">Loading recipes...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
              Try again
            </button>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl">
            {searchTerm ? (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  No recipes found for "{searchTerm}"
                </h3>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">No recipes available</h3>
                <p className="text-gray-600 mb-6">Start by adding your first recipe!</p>
                <button
                  onClick={() => navigate('/recipes/add-recipe')}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  Create Recipe
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onClick={(id) => navigate(`/recipe/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;