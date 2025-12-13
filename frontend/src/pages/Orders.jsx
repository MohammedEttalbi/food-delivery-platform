import { useState } from 'react';
import orderApi from '../api/orderApi';
import Modal from '../components/Modal';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customerId, setCustomerId] = useState('');
    const [restaurantId, setRestaurantId] = useState('');
    const [searchType, setSearchType] = useState('customer');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState({
        customerId: '',
        restaurantId: '',
        restaurantName: '',
        restaurantAddress: '',
        totalAmount: '',
        status: 'PENDING',
        deliveryAddress: '',
    });
    const [newStatus, setNewStatus] = useState('');

    const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

    const searchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            let data;
            if (searchType === 'customer' && customerId) {
                data = await orderApi.getByCustomer(customerId);
            } else if (searchType === 'restaurant' && restaurantId) {
                data = await orderApi.getByRestaurant(restaurantId);
            } else {
                setError('Please enter a valid ID');
                setLoading(false);
                return;
            }
            setOrders(data);
        } catch (err) {
            setError('Failed to fetch orders. Make sure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setFormData({
            customerId: customerId || '',
            restaurantId: '',
            restaurantName: '',
            restaurantAddress: '',
            totalAmount: '',
            status: 'PENDING',
            deliveryAddress: '',
        });
        setIsModalOpen(true);
    };

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status || 'PENDING');
        setIsStatusModalOpen(true);
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                customerId: parseInt(formData.customerId),
                restaurant: {
                    id: parseInt(formData.restaurantId),
                    name: formData.restaurantName || '',
                    address: formData.restaurantAddress || '',
                },
                totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : null,
                status: formData.status,
                deliveryAddress: formData.deliveryAddress || '',
            };
            await orderApi.create(orderData);
            setIsModalOpen(false);
            if (customerId) searchOrders();
        } catch (err) {
            console.error('Error creating order:', err);
            alert('Failed to create order: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await orderApi.updateStatus(selectedOrder.id, newStatus);
            setIsStatusModalOpen(false);
            searchOrders();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    const getStatusClass = (status) => {
        return `status-badge status-${status?.toLowerCase()}`;
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">📋 Orders</h1>
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        + New Order
                    </button>
                </div>

                <div className="filter-bar">
                    <select
                        className="form-input"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        style={{ maxWidth: '180px' }}
                    >
                        <option value="customer">By Customer ID</option>
                        <option value="restaurant">By Restaurant ID</option>
                    </select>
                    {searchType === 'customer' ? (
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Enter Customer ID"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                        />
                    ) : (
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Enter Restaurant ID"
                            value={restaurantId}
                            onChange={(e) => setRestaurantId(e.target.value)}
                        />
                    )}
                    <button className="btn btn-primary" onClick={searchOrders}>
                        Search
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No orders found</h3>
                        <p>Search by customer or restaurant ID to view orders</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Restaurant</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>#{order.customerId}</td>
                                        <td>
                                            {order.restaurant ? (
                                                <div>
                                                    <strong>{order.restaurant.name || `#${order.restaurant.id}`}</strong>
                                                    {order.restaurant.address && (
                                                        <div className="restaurant-address">{order.restaurant.address}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted">N/A</span>
                                            )}
                                        </td>
                                        <td>{order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : '-'}</td>
                                        <td>
                                            <span className={getStatusClass(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{order.deliveryAddress || '-'}</td>
                                        <td>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => openStatusModal(order)}
                                            >
                                                Update Status
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Create Order Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Create New Order"
                >
                    <form onSubmit={handleCreateOrder}>
                        <div className="form-group">
                            <label className="form-label">Customer ID *</label>
                            <input
                                type="number"
                                name="customerId"
                                className="form-input"
                                value={formData.customerId}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., 15"
                            />
                        </div>

                        <div className="form-section-title">Restaurant</div>
                        <div className="form-group">
                            <label className="form-label">Restaurant ID *</label>
                            <input
                                type="number"
                                name="restaurantId"
                                className="form-input"
                                value={formData.restaurantId}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., 1"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Restaurant Name</label>
                            <input
                                type="text"
                                name="restaurantName"
                                className="form-input"
                                value={formData.restaurantName}
                                onChange={handleInputChange}
                                placeholder="e.g., Pizza Palace"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Restaurant Address</label>
                            <input
                                type="text"
                                name="restaurantAddress"
                                className="form-input"
                                value={formData.restaurantAddress}
                                onChange={handleInputChange}
                                placeholder="e.g., 123 Main St"
                            />
                        </div>

                        <div className="form-section-title">Order Details</div>
                        <div className="form-group">
                            <label className="form-label">Total Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                name="totalAmount"
                                className="form-input"
                                value={formData.totalAmount}
                                onChange={handleInputChange}
                                placeholder="e.g., 29.99"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-input"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                {ORDER_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Delivery Address</label>
                            <input
                                type="text"
                                name="deliveryAddress"
                                className="form-input"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                placeholder="e.g., 456 Oak Ave"
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Create Order
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Update Status Modal */}
                <Modal
                    isOpen={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    title="Update Order Status"
                >
                    <div className="form-group">
                        <label className="form-label">New Status</label>
                        <select
                            className="form-input"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsStatusModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleUpdateStatus}>
                            Update
                        </button>
                    </div>
                </Modal>
            </div>

            <style>{`
                .info-note {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    border-radius: var(--radius);
                    padding: 0.75rem 1rem;
                    margin-bottom: 1rem;
                }
                .info-note p {
                    color: var(--info);
                    font-size: 0.85rem;
                    margin: 0;
                }
                .table-container {
                    overflow-x: auto;
                }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .table th,
                .table td {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .table th {
                    color: var(--gray-400);
                    font-weight: 600;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                }
                .table td {
                    color: var(--gray-300);
                }
                .form-section-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--primary-light);
                    margin: 1rem 0 0.75rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(99, 102, 241, 0.3);
                }
                .form-section-title:first-of-type {
                    margin-top: 0;
                }
                .restaurant-address {
                    font-size: 0.8rem;
                    color: var(--gray-500);
                    margin-top: 0.25rem;
                }
                .text-muted {
                    color: var(--gray-500);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}

export default Orders;
