import api from './axiosConfig';

const BASE_URL = '/restaurant-service/menuItems';

const menuItemApi = {
    // Get all menu items
    getAll: async () => {
        const response = await api.get(BASE_URL);
        return response.data._embedded?.menuItems || [];
    },

    // Get menu item by ID
    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Create a new menu item
    create: async (menuItemData) => {
        const response = await api.post(BASE_URL, menuItemData);
        return response.data;
    },

    // Update a menu item
    update: async (id, menuItemData) => {
        const response = await api.put(`${BASE_URL}/${id}`, menuItemData);
        return response.data;
    },

    // Delete a menu item
    delete: async (id) => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    // Link menu item to a menu
    linkToMenu: async (menuItemId, menuUrl) => {
        const response = await api.put(
            `${BASE_URL}/${menuItemId}/menu`,
            menuUrl,
            { headers: { 'Content-Type': 'text/uri-list' } }
        );
        return response.data;
    },
};

export default menuItemApi;
