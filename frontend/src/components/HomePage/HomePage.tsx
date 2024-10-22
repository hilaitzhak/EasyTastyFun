import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin } from 'antd';
import axios from 'axios';
import { Recipe } from '../../interfaces/Recipe';
import { recipeApi } from '../../api/recipe-api';

const { Title } = Typography;

const HomePage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestRecipes = async () => {
            try {
                const response = await recipeApi.getLatestRecipes();
                setRecipes(response.data);
            } catch (err) {
                setError('Failed to load recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestRecipes();
    }, []);

    if (loading) return <Spin size="large" />;
    if (error) return <div>{error}</div>;

    return (
        <div className="home-page">
            <Title level={2}>Latest Recipes</Title>
            <Row gutter={16}>
                {recipes.map((recipe) => (
                    <Col span={8} key={recipe.id}>
                        {/* <Card
                            hoverable
                            cover={<img alt={recipe.title} src={recipe.image} />}
                        >
                            <Card.Meta title={recipe.title} />
                        </Card> */}
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HomePage;
