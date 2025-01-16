import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllRecipes from './pages/AllRecipes';
import CreateRecipeForm from './pages/CreateRecipeForm';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import i18n from './i18n/i18n';
import CategoryPage from './pages/CategoryPage';


const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<AllRecipes />} />
          <Route path="/recipes/add-recipe" element={<CreateRecipeForm />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/recipe/edit/:id" element={<EditRecipe />} />
          <Route path="/categories/:categoryPath" element={<CategoryPage />} />
          <Route path="/categories/:categoryPath/subcategories" element={<CategoryPage />} />
          <Route path="/categories/:categoryPath/:subCategoryPath" element={<CategoryPage />} />
        </Routes>
      </Router>
    );
};

export default App;
