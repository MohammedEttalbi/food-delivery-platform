import api from './axiosConfig';

const BASE_URL = '/restaurant-service/menus';

const menuApi = {
    // Get all menus
    getAll: async () => {
        const response = await api.get(BASE_URL);
        return response.data._embedded?.menus || [];
    },

    // Get menu by ID
    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Get menus by restaurant
    getByRestaurant: async (restaurantId) => {
        const response = await api.get(`${BASE_URL}/search/findByRestaurantId?restaurantId=${restaurantId}`);
        return response.data._embedded?.menus || [];
    },

    // Create a new menu
    create: async (menuData) => {
        const response = await api.post(BASE_URL, menuData);
        return response.data;
    },

    // Update a menu
    update: async (id, menuData) => {
        const response = await api.put(`${BASE_URL}/${id}`, menuData);
        return response.data;
    },

    // Delete a menu
    delete: async (id) => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    // Get menu items for a menu
    getMenuItems: async (menuId) => {
        const response = await api.get(`${BASE_URL}/${menuId}/menuItems`);
        return response.data._embedded?.menuItems || [];
    },
};

export default menuApi;
