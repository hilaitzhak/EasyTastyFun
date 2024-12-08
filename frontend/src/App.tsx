import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AllRecipes from './pages/AllRecipes';
import CreateRecipeForm from './pages/CreateRecipeForm';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';


const App = () => {
    return (
        <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<AllRecipes />} />
          <Route path="/recipes/add-recipe" element={<CreateRecipeForm />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/recipe/edit/:id" element={<EditRecipe />} />
        </Routes>
      </Router>
    );
};

export default App;
