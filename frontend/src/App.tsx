import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllRecipes from './pages/AllRecipes';
import CreateRecipeForm from './pages/CreateRecipeForm';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import RecipePage from './pages/RecipePage';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="1009677730362-r1ij07teaec85blr84pem0r1haud1i1p.apps.googleusercontent.com">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />


            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/recipes" element={<ProtectedRoute><AllRecipes /></ProtectedRoute>} />
              <Route path="/recipes/add-recipe" element={<ProtectedRoute><CreateRecipeForm /></ProtectedRoute>} />
              <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
              <Route path="/recipe/edit/:id" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
              <Route path="/categories/:categoryPath" element={<ProtectedRoute><RecipePage /></ProtectedRoute>} />
              <Route path="/categories/:categoryPath/:subCategoryPath" element={<ProtectedRoute><RecipePage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;