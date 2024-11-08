import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Search, Building, LogOut, Home } from 'lucide-react'
import wallpaper from './wallpaper.jpg';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleManagePropertiesClick = () => {
    if (user?.role === 'BROKER') {
      navigate('/add-property');
    } else {
      alert('Only brokers can access the dashboard. Please log in as a broker.');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{
      backgroundImage: `url(${wallpaper})`
    }}>
      <div className="min-h-screen bg-black bg-opacity-60 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold flex items-center hover:text-blue-200 transition-colors">
              <Home className="mr-2 h-6 w-6" />
              SRM Accommo
            </Link>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={() => navigate('/search')}>
                Search
              </Button>
              <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={handleManagePropertiesClick}>
                Add Property
              </Button>
              <span className="text-white">Welcome, {user?.username}!</span>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" onClick={() => navigate('/login')}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-12 flex flex-col justify-center">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4 shadow-text">Find Your Perfect Student Home</h2>
            <p className="text-xl text-white opacity-90 shadow-text">Discover comfortable and convenient accommodations near SRM University</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Search Accommodations Card */}
            <Card className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-600 flex items-center">
                  <Search className="mr-2 h-6 w-6" /> Search Accommodations
                </CardTitle>
                <CardDescription>Find the perfect place to stay</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Browse through our listings to find your ideal accommodation. Filter by price, location, and amenities.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSearchClick}>
                  Start Searching
                </Button>
              </CardFooter>
            </Card>

            {/* Manage Properties Card */}
            <Card className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-600 flex items-center">
                  <Building className="mr-2 h-6 w-6" /> Manage Properties
                </CardTitle>
                <CardDescription>List and manage your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Add new listings or manage your existing properties. Reach thousands of potential tenants.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white" onClick={handleManagePropertiesClick}>
                  Go to Broker Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-blue-600 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 SRM Accommodation. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage;