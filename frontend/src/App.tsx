import React, { useState } from 'react';
import { Layout } from 'antd';
import RecipeForm from './components/RecipeForm/RecipeForm';
import RecipeList from './components/RecipeList/RecipeList';
import HomePage from './components/HomePage/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const { Header, Content } = Layout;

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<'home' | 'addRecipe' | 'recipeList'>('home');

    const handleRecipeAdded = () => {
      setCurrentPage('recipeList'); // Optionally navigate to the recipe list after adding a recipe
    };

    return (
        <Router>
            <Layout>
                <Header>
                    <h1 style={{ color: 'white' }}>Easy Tasty Fun</h1>
                </Header>
                <Content style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/easy-tasty-fun" element={<HomePage />} />
                        <Route path="/easy-tasty-fun/add-recipe" element={<RecipeForm onRecipeAdded={handleRecipeAdded} />} />
                        <Route path="/easy-tasty-fun/recipes" element={<RecipeList />} />
                    </Routes>
                </Content>
            </Layout>
        </Router>
    );
};

export default App;
