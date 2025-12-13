import api from './axiosConfig';

const BASE_PATH = '/delivery-service/api/deliveries';

export const deliveryApi = {
    // Get all deliveries
    getAll: async () => {
        const response = await api.get(BASE_PATH);
        return response.data;
    },

    // Get delivery by ID
    getById: async (id) => {
        const response = await api.get(`${BASE_PATH}/${id}`);
        return response.data;
    },

    // Get delivery by order ID
    getByOrder: async (orderId) => {
        const response = await api.get(`${BASE_PATH}/order/${orderId}`);
        return response.data;
    },

    // Get deliveries by driver
    getByDriver: async (driverId) => {
        const response = await api.get(`${BASE_PATH}/driver/${driverId}`);
        return response.data;
    },

    // Get active deliveries by driver
    getActiveByDriver: async (driverId) => {
        const response = await api.get(`${BASE_PATH}/driver/${driverId}/active`);
        return response.data;
    },

    // Get deliveries by status
    getByStatus: async (status) => {
        const response = await api.get(`${BASE_PATH}/status/${status}`);
        return response.data;
    },

    // Create delivery
    create: async (data) => {
        const response = await api.post(BASE_PATH, data);
        return response.data;
    },

    // Assign driver
    assignDriver: async (id, driverId, driverName) => {
        const response = await api.put(
            `${BASE_PATH}/${id}/assign?driverId=${driverId}&driverName=${encodeURIComponent(driverName)}`
        );
        return response.data;
    },

    // Mark as picked up
    markPickedUp: async (id) => {
        const response = await api.put(`${BASE_PATH}/${id}/pickup`);
        return response.data;
    },

    // Mark as in transit
    markInTransit: async (id) => {
        const response = await api.put(`${BASE_PATH}/${id}/transit`);
        return response.data;
    },

    // Mark as delivered
    markDelivered: async (id) => {
        const response = await api.put(`${BASE_PATH}/${id}/delivered`);
        return response.data;
    },

    // Cancel delivery
    cancel: async (id, reason = 'Cancelled by user') => {
        const response = await api.put(`${BASE_PATH}/${id}/cancel?reason=${encodeURIComponent(reason)}`);
        return response.data;
    },
};

export default deliveryApi;
