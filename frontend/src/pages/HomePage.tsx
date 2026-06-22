import HeroSection from '../components/HeroSection';
import LatestRecipes from '../components/LatestRecipes';
import RecentlyViewed from '../components/RecentlyViewed';

function HomePage() {

  return (
    <div className="min-h-screen bg-paper">
      <HeroSection />
      <RecentlyViewed />
      <LatestRecipes />
    </div>
  );
};

export default HomePage;