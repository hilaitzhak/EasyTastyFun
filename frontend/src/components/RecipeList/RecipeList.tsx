import React, { useEffect, useState } from 'react';
import { List, Button } from 'antd';
import { recipeApi } from '../../api/recipe-api';
import RecipeDetail from '../RecipeDetail/RecipeDetail';

const RecipeList: React.FC = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

    const fetchRecipes = async () => {
        try {
            const response = await recipeApi.getAll();
            setRecipes(response.data);
        } catch (error) {
            console.error("Failed to fetch recipes:", error);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleRecipeClick = (recipe: any) => {
        setSelectedRecipe(recipe);
    };

    return (
        <>
            <List
                bordered
                dataSource={recipes}
                renderItem={recipe => (
                    <List.Item onClick={() => handleRecipeClick(recipe)}>
                        {recipe.title}
                    </List.Item>
                )}
            />
            {selectedRecipe && <RecipeDetail recipe={selectedRecipe} />}
        </>
    );
};

export default RecipeList;
