import HeroSection from '../components/HeroSection';
import LatestRecipes from '../components/LatestRecipes';

function HomePage() {
  
  return (
    <div className="min-h-screen bg-paper">
      <HeroSection />
      <LatestRecipes />
    </div>
  );
};

export default HomePage;