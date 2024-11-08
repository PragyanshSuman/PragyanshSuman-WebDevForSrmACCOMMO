import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/api'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Home, Image as ImageIcon, LogOut, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import wallpaper from './wallpaper.jpg'
import { Spinner } from './ui/spinner'

type Accommodation = {
  id: number
  title: string
  address: string
  price: number
  distanceFromUniversity: number
  amenities: string[]
  photos: string[]
  contactEmail: string
  contactPhone: string
}

export default function BrokerDashboard() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      fetchAccommodations()
    }
  }, [user, navigate])

  const fetchAccommodations = async () => {
    if (user?.id) {
      setIsLoading(true)
      try {
        const data = await api.getAccommodationsByBrokerId(user.id)
        console.log('Fetched accommodations:', data)
        setAccommodations(data)
      } catch (error) {
        console.error('Error fetching accommodations:', error)
        toast.error('Failed to fetch your accommodations. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (user) {
        const response = await api.createAccommodation(formData, user.username)
        setAccommodations([...accommodations, response])
        toast.success('Accommodation uploaded successfully')
        e.currentTarget.reset()
        setPhotos([])
        setShowForm(false)
        fetchAccommodations()
      } else {
        throw new Error('User not logged in')
      }
    } catch (error) {
      console.error('Error uploading accommodation:', error)
      toast.error(`Failed to upload accommodation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.deleteAccommodation(id)
      setAccommodations(prevAccommodations => prevAccommodations.filter(acc => acc.id !== id))
      toast.success('Accommodation deleted successfully')
    } catch (error) {
      console.error('Error deleting accommodation:', error)
      toast.error('Failed to delete accommodation')
    }
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed" 
      style={{
        backgroundImage: `url(${wallpaper})`
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-60 flex flex-col">
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
              <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide Form' : 'Add Property'}
              </Button>
              <span className="text-white">Welcome, {user?.username}!</span>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" onClick={() => navigate('/login')}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Broker Dashboard</h2>
          
          {showForm && (
            <Card className="mb-8 bg-white bg-opacity-20 backdrop-blur-md rounded-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Upload New Accommodation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input id="title" name="title" type="text" placeholder="Accommodation Title" required className="bg-white bg-opacity-50" />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-white">Address</Label>
                    <Input id="address" name="address" type="text" placeholder="Address" required className="bg-white bg-opacity-50" />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-white">Price (₹/month)</Label>
                    <Input id="price" name="price" type="number" placeholder="Price" required className="bg-white bg-opacity-50" />
                  </div>
                  <div>
                    <Label htmlFor="distanceFromUniversity" className="text-white">Distance from SRM (km)</Label>
                    <Input id="distanceFromUniversity" name="distanceFromUniversity" type="number" placeholder="Distance" required className="bg-white bg-opacity-50" />
                  </div>
                  <div>
                    <Label htmlFor="amenities" className="text-white">Amenities (comma-separated)</Label>
                    <Input id="amenities" name="amenities" type="text" placeholder="Amenities" required className="bg-white bg-opacity-50" />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
                    <Input id="contactEmail" name="contactEmail" type="email" placeholder="Contact Email" required className="bg-white bg-opacity-50" />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone" className="text-white">Contact Phone</Label>
                    <Input id="contactPhone" name="contactPhone" type="tel" placeholder="Contact Phone" required className="bg-white bg-opacity-50" />
                  </div>
                  <div>
                    <Label htmlFor="photos" className="text-white">Upload Photos</Label>
                    <Input id="photos" name="photos" type="file" accept="image/*" multiple onChange={handlePhotoChange} className="bg-white bg-opacity-50" />
                  </div>
                  {photos.length > 0 && (
                    <p className="text-sm text-white">{photos.length} photo(s) selected</p>
                  )}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Spinner className="mr-2" />
                        Uploading...
                      </>
                    ) : (
                      'Upload Accommodation'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <h3 className="text-2xl font-bold mb-4 text-white">Your Accommodations</h3>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Spinner className="text-white" />
            </div>
          ) : accommodations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodations.map((accommodation) => (
                <Card key={accommodation.id} className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle>{accommodation.title}</CardTitle>
                    <CardDescription>{accommodation.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">₹{accommodation.price}/month</p>
                    <p>{accommodation.distanceFromUniversity} km from SRM</p>
                    <div className="mt-2">
                      <p className="font-semibold">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {accommodation.amenities.map((amenity, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="font-semibold">Contact:</p>
                      <p>{accommodation.contactEmail}</p>
                      <p>{accommodation.contactPhone}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center">
                    {accommodation.photos && accommodation.photos.length > 0 ? (
                      <img
                        src={accommodation.photos[0]}
                        alt={accommodation.title}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleDelete(accommodation.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-white text-center">No accommodations found. Start by uploading a new one!</p>
          )}
        </main>

        <footer className="bg-blue-600 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 SRM Accommodation. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}