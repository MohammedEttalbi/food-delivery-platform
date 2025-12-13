import api from './axiosConfig';

const BASE_PATH = '/restaurant-service/restaurants';

export const restaurantApi = {
    // Get all restaurants (Spring Data REST returns _embedded)
    getAll: async () => {
        const response = await api.get(BASE_PATH);
        // Spring Data REST wraps collection in _embedded
        return response.data._embedded?.restaurants || [];
    },

    // Get restaurant by ID
    getById: async (id) => {
        const response = await api.get(`${BASE_PATH}/${id}`);
        return response.data;
    },

    // Create a new restaurant
    create: async (data) => {
        const response = await api.post(BASE_PATH, data);
        return response.data;
    },

    // Update restaurant
    update: async (id, data) => {
        const response = await api.put(`${BASE_PATH}/${id}`, data);
        return response.data;
    },

    // Delete restaurant
    delete: async (id) => {
        await api.delete(`${BASE_PATH}/${id}`);
    },
};

export default restaurantApi;
