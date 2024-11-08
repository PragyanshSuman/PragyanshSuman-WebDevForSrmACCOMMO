import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api/api'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"
import { Search, Building, LogOut, Home, DollarSign, MapPin, Wifi, Coffee, Tv, Image as ImageIcon, BedDouble, Bath, Filter, Star } from 'lucide-react'
import wallpaper from './wallpaper.jpg'

type Accommodation = {
  id: number
  title: string
  address: string
  price: number
  distanceFromUniversity: number
  amenities: string[]
  photos: string[]
  bedrooms: number
  bathrooms: number
  propertyType: string
}

type SortOption = 'price_asc' | 'price_desc' | 'distance_asc' | 'distance_desc'

export default function EnhancedSearchPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 10])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [bedroomFilter, setBedroomFilter] = useState<number | 'any' | null>(null)
  const [bathroomFilter, setBathroomFilter] = useState<number | 'any' | null>(null)
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string | 'any' | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('price_asc')
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const data = await api.getAccommodations()
        setAccommodations(data)
      } catch (error) {
        console.error('Error fetching accommodations:', error)
        alert('Failed to fetch accommodations. Please try again.')
      }
    }

    fetchAccommodations()
  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    setSearchTerm(searchParams.get('search') || '')
    setPriceRange([
      parseInt(searchParams.get('minPrice') || '0'),
      parseInt(searchParams.get('maxPrice') || '20000')
    ])
    setDistanceRange([
      parseFloat(searchParams.get('minDistance') || '0'),
      parseFloat(searchParams.get('maxDistance') || '10')
    ])
    setSelectedAmenities(searchParams.getAll('amenities'))
    setBedroomFilter(searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : null)
    setBathroomFilter(searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : null)
    setPropertyTypeFilter(searchParams.get('propertyType') || null)
    setSortBy(searchParams.get('sortBy') as SortOption || 'price_asc')
  }, [location.search])

  const updateSearchParams = () => {
    const searchParams = new URLSearchParams()
    if (searchTerm) searchParams.set('search', searchTerm)
    searchParams.set('minPrice', priceRange[0].toString())
    searchParams.set('maxPrice', priceRange[1].toString())
    searchParams.set('minDistance', distanceRange[0].toString())
    searchParams.set('maxDistance', distanceRange[1].toString())
    selectedAmenities.forEach(amenity => searchParams.append('amenities', amenity))
    if (bedroomFilter) searchParams.set('bedrooms', bedroomFilter.toString())
    if (bathroomFilter) searchParams.set('bathrooms', bathroomFilter.toString())
    if (propertyTypeFilter) searchParams.set('propertyType', propertyTypeFilter)
    searchParams.set('sortBy', sortBy)
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  const filteredAccommodations = useMemo(() => {
    return accommodations
      .filter((accommodation) => {
        const matchesSearch = accommodation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              accommodation.address.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPrice = accommodation.price >= priceRange[0] && accommodation.price <= priceRange[1]
        const matchesDistance = accommodation.distanceFromUniversity >= distanceRange[0] && accommodation.distanceFromUniversity <= distanceRange[1]
        const matchesAmenities = selectedAmenities.every(amenity => accommodation.amenities.includes(amenity))
        const matchesBedrooms = bedroomFilter !== null ? (bedroomFilter === 'any' || accommodation.bedrooms === bedroomFilter) : true
        const matchesBathrooms = bathroomFilter !== null ? (bathroomFilter === 'any' || accommodation.bathrooms === bathroomFilter) : true
        const matchesPropertyType = propertyTypeFilter !== null ? (propertyTypeFilter === 'any' || accommodation.propertyType === propertyTypeFilter) : true
        return matchesSearch && matchesPrice && matchesDistance && matchesAmenities && matchesBedrooms && matchesBathrooms && matchesPropertyType
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price
          case 'price_desc':
            return b.price - a.price
          case 'distance_asc':
            return a.distanceFromUniversity - b.distanceFromUniversity
          case 'distance_desc':
            return b.distanceFromUniversity - a.distanceFromUniversity
          default:
            return 0
        }
      })
  }, [accommodations, searchTerm, priceRange, distanceRange, selectedAmenities, bedroomFilter, bathroomFilter, propertyTypeFilter, sortBy])

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleApplyFilters = () => {
    if (bedroomFilter === 'any') setBedroomFilter(null)
    if (bathroomFilter === 'any') setBathroomFilter(null)
    if (propertyTypeFilter === 'any') setPropertyTypeFilter(null)
    updateSearchParams()
    setIsSheetOpen(false)
  }

  if (!user) {
    return <div>Please log in to search for accommodations.</div>
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
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-3xl font-bold flex items-center hover:text-blue-200 transition-colors">
                <Home className="mr-2 h-6 w-6" />
                SRM Accommo
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
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Find Your Perfect Accommodation</h1>
            <p className="text-gray-200">Discover comfortable and convenient living spaces near SRM University</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-8 shadow-lg">
            <div className="flex gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by location, property name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] bg-white">
                  <ScrollArea className="h-full">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filter Options</SheetTitle>
                      <SheetDescription>Refine your accommodation search</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label>Price Range</Label>
                        <div className="flex items-center justify-between text-sm">
                          <span>₹{priceRange[0].toLocaleString()}</span>
                          <span>₹{priceRange[1].toLocaleString()}</span>
                        </div>
                        <Slider
                          min={0}
                          max={20000}
                          step={1000}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <Label>Distance from University</Label>
                        <div className="flex items-center justify-between text-sm">
                          <span>{distanceRange[0]} km</span>
                          <span>{distanceRange[1]} km</span>
                        </div>
                        <Slider
                          min={0}
                          max={10}
                          step={0.5}
                          value={distanceRange}
                          onValueChange={(value) => setDistanceRange(value as [number, number])}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Amenities</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {['WiFi', 'AC', 'TV', 'Parking', 'Gym', 'Laundry'].map((amenity) => (
                            <div key={amenity} className="flex items-center space-x-2">
                              <Checkbox
                                id={`amenity-${amenity}`}
                                checked={selectedAmenities.includes(amenity)}
                                onCheckedChange={() => handleAmenityChange(amenity)}
                              />
                              <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                                {amenity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Bedrooms</Label>
                          <Select value={bedroomFilter?.toString() || 'any'} onValueChange={(value) => setBedroomFilter(value === 'any' ? 'any' : parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              {[1, 2, 3, 4, '5+'].map((num) => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Bathrooms</Label>
                          <Select value={bathroomFilter?.toString() || 'any'} onValueChange={(value) => setBathroomFilter(value === 'any' ? 'any' : parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              {[1, 2, 3, '4+'].map((num) => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Property Type</Label>
                        <Select value={propertyTypeFilter || 'any'} onValueChange={value => setPropertyTypeFilter(value === 'any' ? null : value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            {['Apartment', 'House', 'Studio', 'Dormitory'].map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Sort by</Label>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                            <SelectItem value="distance_asc">Distance: Nearest</SelectItem>
                            <SelectItem value="distance_desc">Distance: Farthest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full" onClick={handleApplyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <p className="text-lg text-white">
              <span className="font-semibold">{filteredAccommodations.length}</span> properties found
            </p>
            <div className="flex gap-2">
              {selectedAmenities.length > 0 && (
                <Badge variant="secondary">
                  {selectedAmenities.length} amenities
                </Badge>
              )}
              {(bedroomFilter || bathroomFilter || propertyTypeFilter) && (
                <Badge variant="secondary">
                  Filters applied
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccommodations.map((accommodation) => (
              <Card key={accommodation.id} className="group hover:shadow-2xl transition-all duration-300 bg-white">
                <div className="relative">
                  {accommodation.photos && accommodation.photos.length > 0 ? (
                    <img 
                      src={accommodation.photos[0]} 
                      alt={accommodation.title} 
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{accommodation.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        {accommodation.address}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg font-semibold">
                      ₹{accommodation.price.toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <BedDouble className="h-4 w-4 mr-1 text-muted-foreground" />
                          {accommodation.bedrooms} {accommodation.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                        </span>
                        <span className="flex items-center">
                          <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                          {accommodation.bathrooms} {accommodation.bathrooms === 1 ? 'Bath' : 'Baths'}
                        </span>
                      </div>
                      <span className="flex items-center text-blue-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {accommodation.distanceFromUniversity} km
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {accommodation.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {amenity === 'WiFi' && <Wifi className="h-3 w-3" />}
                          {amenity === 'AC' && <Coffee className="h-3 w-3" />}
                          {amenity === 'TV' && <Tv className="h-3 w-3" />}
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/accommodation/${accommodation.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
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