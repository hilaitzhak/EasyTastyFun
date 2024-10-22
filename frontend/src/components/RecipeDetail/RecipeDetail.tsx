import React from 'react';
import { Modal } from 'antd';

const RecipeDetail: React.FC<{ recipe: any }> = ({ recipe }) => {
    return (
        <Modal
            title={recipe.title}
            footer={null}
            onCancel={() => {}}
        >
            <h4>Ingredients:</h4>
            <p>{recipe.ingredients.join(', ')}</p>
            <h4>Instructions:</h4>
            <p>{recipe.instructions}</p>
        </Modal>
    );
};

export default RecipeDetail;
