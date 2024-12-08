import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'All Recipes', path: '/recipes' },
  { name: 'Cakes', path: '/category/cakes' },
  { name: 'Desserts', path: '/category/desserts' },
  { name: 'Hot Stews', path: '/category/stews' },
  { name: 'Pasta', path: '/category/pasta' },
  { name: 'Salads', path: '/category/salads' },
  { name: 'Breakfast', path: '/category/breakfast' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* <Link to="/" className="text-2xl font-bold italic tracking-wide">
            CulinaryDelight
          </Link> */}
          
          <div className="hidden md:flex space-x-6">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-white/90 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/10"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-6">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="block py-2 px-4 text-white/90 hover:bg-white/10 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;