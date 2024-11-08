import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Home, LogOut, MapPin, DollarSign, Mail, Phone } from 'lucide-react'
import wallpaper from './wallpaper.jpg';

type Accommodation = {
  id: number;
  title: string;
  address: string;
  price: number;
  distanceFromUniversity: number;
  amenities: string[];
  photos: string[];
  contactEmail: string;
  contactPhone: string;
};

const AccommodationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const data = await api.getAccommodationById(Number(id));
        setAccommodation(data);
      } catch (error) {
        console.error('Error fetching accommodation:', error);
        alert('Failed to fetch accommodation details. Please try again.');
      }
    };

    fetchAccommodation();
  }, [id]);

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center" style={{
        backgroundImage: `url(${wallpaper})`
      }}>
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{
      backgroundImage: `url(${wallpaper})`
    }}>
      <div className="min-h-screen bg-black bg-opacity-60 flex flex-col">
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold flex items-center hover:text-blue-200 transition-colors">
              <Home className="mr-2 h-6 w-6" />
              SRM Accommodation
            </Link>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={() => navigate('/search')}>
                Search
              </Button>
              <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={() => navigate('/add-property')}>
                Add Property
              </Button>
              <span className="text-white">Welcome, {user?.username}!</span>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" onClick={() => navigate('/login')}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="bg-white bg-opacity-90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{accommodation.title}</CardTitle>
              <CardDescription className="text-lg">{accommodation.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-w-16 aspect-h-9">
                {accommodation.photos && accommodation.photos.length > 0 ? (
                  <img 
                    src={accommodation.photos[0]} 
                    alt={accommodation.title} 
                    className="object-cover rounded-lg shadow-md w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="text-xl font-semibold">₹{accommodation.price}/month</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{accommodation.distanceFromUniversity} km from SRM</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {accommodation.amenities.map((amenity, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    <span>{accommodation.contactEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    <span>{accommodation.contactPhone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Contact Owner
              </Button>
            </CardFooter>
          </Card>
        </main>

        <footer className="bg-blue-600 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 SRM Accommodation. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AccommodationDetails;