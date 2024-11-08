import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Home, User, Lock, Mail, UserPlus } from 'lucide-react'
import wallpaper from './wallpaper.jpg';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'USER' | 'BROKER'>('USER');

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(username, email, password, role);
      alert('Signup successful! Please log in.');
      setActiveTab('login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center" style={{
      backgroundImage: `url(${wallpaper})`
    }}>
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-4xl font-bold text-white mb-8 hover:text-blue-200 transition-colors">
          <Home className="inline-block mr-2 h-8 w-8" />
          SRM Accommo
        </Link>
        <Card className="bg-white bg-opacity-80 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to SRM Accommodation</CardTitle>
            <CardDescription className="text-center">Login or sign up to get started</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tab buttons for switching between login and signup */}
            <div className="flex mb-6">
              <Button
                className={`flex-1 ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </Button>
              <Button
                className={`flex-1 ${activeTab === 'signup' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </Button>
            </div>
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center">
                    <User className="mr-2 h-4 w-4" /> Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" /> Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="flex items-center">
                    <User className="mr-2 h-4 w-4" /> Username
                  </Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" /> Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" /> Role
                  </Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'USER' | 'BROKER')}
                    className="w-full p-2 border rounded"
                  >
                    <option value="USER">Student</option>
                    <option value="BROKER">Property Owner</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Sign Up
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;