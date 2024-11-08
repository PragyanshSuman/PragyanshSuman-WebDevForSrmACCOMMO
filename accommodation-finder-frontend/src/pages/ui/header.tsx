import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from "./button"
import { Home, LogOut, LogIn } from 'lucide-react'
import { toast } from 'react-hot-toast';
import { useAuth } from '../../useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      toast.error('Please log in to access this feature.');
      navigate('/login');
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold flex items-center hover:text-blue-200 transition-colors">
          <Home className="mr-2 h-6 w-6" />
          SRM Accommodation
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={() => handleNavigation('/search')}>
            Search
          </Button>
          <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={() => handleNavigation('/add-property')}>
            List Property
          </Button>
          {user ? (
            <>
              <span className="text-white">Welcome, {user.username}!</span>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" onClick={() => navigate('/login')}>
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;