import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllRecipes from './pages/AllRecipes';
import CreateRecipeForm from './pages/CreateRecipeForm';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import i18n from './i18n/i18n';
import RecipePage from './pages/RecipePage';
import Layout from './components/Layout';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<AllRecipes />} />
          <Route path="/recipes/add-recipe" element={<CreateRecipeForm />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/recipe/edit/:id" element={<EditRecipe />} />
          <Route path="/categories/:categoryPath" element={<RecipePage />} />
          <Route path="/categories/:categoryPath/:subCategoryPath" element={<RecipePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
