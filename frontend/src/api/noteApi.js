import api from './axiosConfig';

const BASE_PATH = '/note-service/ratings';

export const noteApi = {
    // Get ratings by restaurant
    getByRestaurant: async (restaurantId) => {
        const response = await api.get(`${BASE_PATH}/restaurants/${restaurantId}`);
        return response.data;
    },

    // Get average rating for restaurant
    getAverage: async (restaurantId) => {
        const response = await api.get(`${BASE_PATH}/restaurants/${restaurantId}/average`);
        return response.data;
    },

    // Create a new rating
    create: async (data) => {
        const response = await api.post(BASE_PATH, data);
        return response.data;
    },

    // Delete rating
    delete: async (id) => {
        await api.delete(`${BASE_PATH}/${id}`);
    },
};

export default noteApi;
