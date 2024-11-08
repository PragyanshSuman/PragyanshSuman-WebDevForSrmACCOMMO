import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const api = {
  setAuthToken: (token: string | null) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },

  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string, role: 'USER' | 'BROKER') => {
    const response = await axiosInstance.post('/auth/register', { username, email, password, role });
    return response.data;
  },

  getAccommodations: async () => {
    const response = await axiosInstance.get('/accommodations');
    return response.data;
  },

  getAccommodationById: async (id: number) => {
    const response = await axiosInstance.get(`/accommodations/${id}`);
    return response.data;
  },

  createAccommodation: async (formData: FormData, brokerUsername: string) => {
    const accommodationData = {
        title: formData.get('title'),
        address: formData.get('address'),
        price: Number(formData.get('price')),
        distanceFromUniversity: Number(formData.get('distanceFromUniversity')),
        amenities: (formData.get('amenities') as string).split(',').map(a => a.trim()),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone'),
        brokerUsername: brokerUsername
    };

    const newFormData = new FormData();
    newFormData.append('accommodation', new Blob([JSON.stringify(accommodationData)], {
        type: 'application/json'
    }));

    const photos = formData.getAll('photos');
    photos.forEach(photo => {
        newFormData.append('photos', photo);
    });

    const response = await axiosInstance.post('/accommodations', newFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
},

  getAccommodationsByBrokerId: async (brokerId: number) => {
    const response = await axiosInstance.get(`/accommodations/broker/${brokerId}`);
    return response.data;
  },

  deleteAccommodation: async (id: number) => {
    const response = await axiosInstance.delete(`/accommodations/${id}`);
    return response.data;
  },

  updateAccommodation: async (id: number, accommodationData: FormData) => {
    try {
      const response = await axiosInstance.put(`/accommodations/${id}`, accommodationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating accommodation:', error);
      throw error;
    }
  },
};