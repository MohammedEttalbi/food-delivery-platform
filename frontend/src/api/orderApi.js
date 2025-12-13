import api from './axiosConfig';

const BASE_PATH = '/order-service/api/orders';

export const orderApi = {
    // Get orders by customer ID
    getByCustomer: async (customerId) => {
        const response = await api.get(`${BASE_PATH}?customerId=${customerId}`);
        return response.data;
    },

    // Get order by ID
    getById: async (id) => {
        const response = await api.get(`${BASE_PATH}/${id}`);
        return response.data;
    },

    // Get orders by restaurant
    getByRestaurant: async (restaurantId) => {
        const response = await api.get(`${BASE_PATH}/by-restaurant/${restaurantId}`);
        return response.data;
    },

    // Create a new order
    create: async (data) => {
        const response = await api.post(BASE_PATH, data);
        return response.data;
    },

    // Update order status
    updateStatus: async (id, status) => {
        const response = await api.patch(`${BASE_PATH}/${id}/status`, { status });
        return response.data;
    },
};

export default orderApi;
