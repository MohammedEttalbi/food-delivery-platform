import { useState, useEffect } from 'react';
import deliveryApi from '../api/deliveryApi';
import Modal from '../components/Modal';

function Deliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    // Search/Filter states
    const [searchType, setSearchType] = useState('all');
    const [searchId, setSearchId] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [driverId, setDriverId] = useState('');
    const [activeOnly, setActiveOnly] = useState(false);

    // Create delivery form - matches DeliveryRequestDTO
    const [formData, setFormData] = useState({
        orderId: '',
        driverId: '',
        restaurantAddress: '',
        customerAddress: '',
        notes: '',
    });

    const [assignData, setAssignData] = useState({
        driverId: '',
        driverName: '',
    });

    const STATUSES = ['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

    useEffect(() => {
        if (searchType === 'all' || searchType === 'status') {
            fetchDeliveries();
        }
    }, [filterStatus, searchType]);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            setError(null);
            let data;
            if (filterStatus && searchType === 'status') {
                data = await deliveryApi.getByStatus(filterStatus);
            } else {
                data = await deliveryApi.getAll();
            }
            setDeliveries(data);
        } catch (err) {
            setError('Failed to fetch deliveries. Make sure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchId && searchType !== 'all' && searchType !== 'status' && searchType !== 'driver') {
            setError('Please enter an ID to search');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            let data;
            switch (searchType) {
                case 'id':
                    data = await deliveryApi.getById(parseInt(searchId));
                    setDeliveries(data ? [data] : []);
                    break;
                case 'order':
                    data = await deliveryApi.getByOrder(parseInt(searchId));
                    setDeliveries(data ? [data] : []);
                    break;
                case 'driver':
                    if (activeOnly) {
                        data = await deliveryApi.getActiveByDriver(parseInt(driverId));
                    } else {
                        data = await deliveryApi.getByDriver(parseInt(driverId));
                    }
                    setDeliveries(data || []);
                    break;
                case 'status':
                    if (filterStatus) {
                        data = await deliveryApi.getByStatus(filterStatus);
                    } else {
                        data = await deliveryApi.getAll();
                    }
                    setDeliveries(data || []);
                    break;
                default:
                    data = await deliveryApi.getAll();
                    setDeliveries(data || []);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setDeliveries([]);
                setError('No delivery found with the given ID');
            } else {
                setError('Failed to fetch deliveries');
            }
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
        setFormData({ orderId: '', driverId: '', restaurantAddress: '', customerAddress: '', notes: '' });
        setIsModalOpen(true);
    };

    const openAssignModal = (delivery) => {
        setSelectedDelivery(delivery);
        setAssignData({ driverId: '', driverName: '' });
        setIsAssignModalOpen(true);
    };

    const openDetailModal = (delivery) => {
        setSelectedDelivery(delivery);
        setIsDetailModalOpen(true);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await deliveryApi.create({
                orderId: parseInt(formData.orderId),
                driverId: parseInt(formData.driverId),
                restaurantAddress: formData.restaurantAddress,
                customerAddress: formData.customerAddress,
                notes: formData.notes,
            });
            setIsModalOpen(false);
            fetchDeliveries();
        } catch (err) {
            console.error('Error creating delivery:', err);
            alert('Failed to create delivery: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleAssign = async () => {
        try {
            await deliveryApi.assignDriver(
                selectedDelivery.id,
                parseInt(assignData.driverId),
                assignData.driverName
            );
            setIsAssignModalOpen(false);
            fetchDeliveries();
        } catch (err) {
            console.error('Error assigning driver:', err);
            alert('Failed to assign driver');
        }
    };

    const handleStatusAction = async (id, action) => {
        try {
            switch (action) {
                case 'pickup':
                    await deliveryApi.markPickedUp(id);
                    break;
                case 'transit':
                    await deliveryApi.markInTransit(id);
                    break;
                case 'delivered':
                    await deliveryApi.markDelivered(id);
                    break;
                case 'cancel':
                    const reason = prompt('Enter cancellation reason (optional):') || 'Cancelled by user';
                    await deliveryApi.cancel(id, reason);
                    break;
                default:
                    return;
            }
            fetchDeliveries();
        } catch (err) {
            console.error('Error updating delivery:', err);
            alert('Failed to update delivery status');
        }
    };

    const getStatusClass = (status) => {
        return `status-badge status-${status?.toLowerCase()}`;
    };

    const getAvailableActions = (status) => {
        switch (status) {
            case 'PENDING':
                return [{ action: 'assign', label: 'Assign Driver', btnClass: 'btn-primary' }];
            case 'ASSIGNED':
                return [{ action: 'pickup', label: 'Mark Picked Up', btnClass: 'btn-warning' }];
            case 'PICKED_UP':
                return [{ action: 'transit', label: 'In Transit', btnClass: 'btn-info' }];
            case 'IN_TRANSIT':
                return [{ action: 'delivered', label: 'Delivered', btnClass: 'btn-success' }];
            default:
                return [];
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">🚚 Deliveries</h1>
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        + New Delivery
                    </button>
                </div>

                {/* Advanced Search Panel */}
                <div className="search-panel">
                    <h3 className="search-title">🔍 Search & Filter</h3>
                    <div className="search-options">
                        <div className="search-row">
                            <select
                                className="form-input"
                                value={searchType}
                                onChange={(e) => {
                                    setSearchType(e.target.value);
                                    setDeliveries([]);
                                    setError(null);
                                }}
                            >
                                <option value="all">All Deliveries</option>
                                <option value="id">By Delivery ID</option>
                                <option value="order">By Order ID</option>
                                <option value="driver">By Driver ID</option>
                                <option value="status">By Status</option>
                            </select>

                            {(searchType === 'id' || searchType === 'order') && (
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder={searchType === 'id' ? 'Enter Delivery ID' : 'Enter Order ID'}
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                            )}

                            {searchType === 'driver' && (
                                <>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Enter Driver ID"
                                        value={driverId}
                                        onChange={(e) => setDriverId(e.target.value)}
                                    />
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={activeOnly}
                                            onChange={(e) => setActiveOnly(e.target.checked)}
                                        />
                                        <span>Active Only</span>
                                    </label>
                                </>
                            )}

                            {searchType === 'status' && (
                                <select
                                    className="form-input"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    {STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button className="btn btn-primary" onClick={handleSearch}>
                                Search
                            </button>
                            <button className="btn btn-secondary" onClick={() => {
                                setSearchType('all');
                                setSearchId('');
                                setDriverId('');
                                setFilterStatus('');
                                setActiveOnly(false);
                                fetchDeliveries();
                            }}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* API Endpoints Reference */}
                <div className="api-reference">
                    <details>
                        <summary>📋 Available API Endpoints</summary>
                        <div className="api-list">
                            <div className="api-item"><span className="method get">GET</span> /api/deliveries - Get all</div>
                            <div className="api-item"><span className="method get">GET</span> /api/deliveries/{'{id}'} - Get by ID</div>
                            <div className="api-item"><span className="method get">GET</span> /api/deliveries/order/{'{orderId}'} - Get by order</div>
                            <div className="api-item"><span className="method get">GET</span> /api/deliveries/driver/{'{driverId}'} - Get by driver</div>
                            <div className="api-item"><span className="method get">GET</span> /api/deliveries/driver/{'{driverId}'}/active - Active by driver</div>
                            <div className="api-item"><span className="method get">GET</span> /api/deliveries/status/{'{status}'} - Get by status</div>
                            <div className="api-item"><span className="method post">POST</span> /api/deliveries - Create</div>
                            <div className="api-item"><span className="method put">PUT</span> /api/deliveries/{'{id}'}/assign - Assign</div>
                            <div className="api-item"><span className="method put">PUT</span> /api/deliveries/{'{id}'}/pickup - Pickup</div>
                            <div className="api-item"><span className="method put">PUT</span> /api/deliveries/{'{id}'}/transit - Transit</div>
                            <div className="api-item"><span className="method put">PUT</span> /api/deliveries/{'{id}'}/delivered - Delivered</div>
                            <div className="api-item"><span className="method put">PUT</span> /api/deliveries/{'{id}'}/cancel - Cancel</div>
                        </div>
                    </details>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="results-header">
                    <span>{deliveries.length} delivery(ies) found</span>
                </div>

                {deliveries.length === 0 ? (
                    <div className="empty-state">
                        <h3>No deliveries found</h3>
                        <p>Create a new delivery or try a different search</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {deliveries.map((delivery) => (
                            <div className="card delivery-card" key={delivery.id}>
                                <div className="delivery-header">
                                    <span className="delivery-id">Delivery #{delivery.id}</span>
                                    <span className={getStatusClass(delivery.status)}>
                                        {delivery.status}
                                    </span>
                                </div>

                                <div className="delivery-details">
                                    <div className="delivery-info">
                                        <span className="info-label">Order ID:</span>
                                        <span className="info-value">#{delivery.orderId}</span>
                                    </div>
                                    {delivery.driverId && (
                                        <div className="delivery-info">
                                            <span className="info-label">Driver ID:</span>
                                            <span className="info-value">#{delivery.driverId}</span>
                                        </div>
                                    )}
                                    {delivery.driverName && (
                                        <div className="delivery-info">
                                            <span className="info-label">Driver:</span>
                                            <span className="info-value">{delivery.driverName}</span>
                                        </div>
                                    )}
                                    {delivery.restaurantAddress && (
                                        <div className="delivery-info">
                                            <span className="info-label">📍 Pickup:</span>
                                            <span className="info-value">{delivery.restaurantAddress}</span>
                                        </div>
                                    )}
                                    {delivery.customerAddress && (
                                        <div className="delivery-info">
                                            <span className="info-label">🏠 Delivery:</span>
                                            <span className="info-value">{delivery.customerAddress}</span>
                                        </div>
                                    )}
                                    {delivery.distanceKm && (
                                        <div className="delivery-info">
                                            <span className="info-label">📏 Distance:</span>
                                            <span className="info-value">{delivery.distanceKm.toFixed(2)} km</span>
                                        </div>
                                    )}
                                    {delivery.estimatedTimeMinutes && (
                                        <div className="delivery-info">
                                            <span className="info-label">⏱️ ETA:</span>
                                            <span className="info-value">{delivery.estimatedTimeMinutes} min</span>
                                        </div>
                                    )}
                                    {delivery.trackingUrl && (
                                        <div className="delivery-info">
                                            <a href={delivery.trackingUrl} target="_blank" rel="noopener noreferrer" className="tracking-link">
                                                🗺️ Open Tracking Map
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="delivery-actions">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => openDetailModal(delivery)}
                                    >
                                        View Details
                                    </button>
                                    {getAvailableActions(delivery.status).map(({ action, label, btnClass }) =>
                                        action === 'assign' ? (
                                            <button
                                                key={action}
                                                className={`btn btn-sm ${btnClass}`}
                                                onClick={() => openAssignModal(delivery)}
                                            >
                                                {label}
                                            </button>
                                        ) : (
                                            <button
                                                key={action}
                                                className={`btn btn-sm ${btnClass}`}
                                                onClick={() => handleStatusAction(delivery.id, action)}
                                            >
                                                {label}
                                            </button>
                                        )
                                    )}
                                    {!['DELIVERED', 'CANCELLED'].includes(delivery.status) && (
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleStatusAction(delivery.id, 'cancel')}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Delivery Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Create New Delivery"
                >
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label className="form-label">Order ID *</label>
                            <input
                                type="number"
                                name="orderId"
                                className="form-input"
                                value={formData.orderId}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter the order ID"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Driver ID *</label>
                            <input
                                type="number"
                                name="driverId"
                                className="form-input"
                                value={formData.driverId}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter the driver ID"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Restaurant Address *</label>
                            <input
                                type="text"
                                name="restaurantAddress"
                                className="form-input"
                                value={formData.restaurantAddress}
                                onChange={handleInputChange}
                                required
                                placeholder="Restaurant pickup address"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Customer Address *</label>
                            <input
                                type="text"
                                name="customerAddress"
                                className="form-input"
                                value={formData.customerAddress}
                                onChange={handleInputChange}
                                required
                                placeholder="Customer delivery address"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                name="notes"
                                className="form-input"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Optional delivery notes"
                                rows="2"
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
                                Create Delivery
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Assign Driver Modal */}
                <Modal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    title="Assign Driver"
                >
                    <div className="form-group">
                        <label className="form-label">Driver ID *</label>
                        <input
                            type="number"
                            className="form-input"
                            value={assignData.driverId}
                            onChange={(e) =>
                                setAssignData((prev) => ({ ...prev, driverId: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Driver Name *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={assignData.driverName}
                            onChange={(e) =>
                                setAssignData((prev) => ({ ...prev, driverName: e.target.value }))
                            }
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsAssignModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleAssign}>
                            Assign
                        </button>
                    </div>
                </Modal>

                {/* Delivery Details Modal */}
                <Modal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    title={`Delivery #${selectedDelivery?.id} Details`}
                >
                    {selectedDelivery && (
                        <div className="detail-grid">
                            <div className="detail-row">
                                <span className="detail-label">ID:</span>
                                <span className="detail-value">{selectedDelivery.id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Order ID:</span>
                                <span className="detail-value">{selectedDelivery.orderId}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status:</span>
                                <span className={getStatusClass(selectedDelivery.status)}>{selectedDelivery.status}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Driver ID:</span>
                                <span className="detail-value">{selectedDelivery.driverId || '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Driver Name:</span>
                                <span className="detail-value">{selectedDelivery.driverName || '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Restaurant:</span>
                                <span className="detail-value">{selectedDelivery.restaurantAddress || '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Customer:</span>
                                <span className="detail-value">{selectedDelivery.customerAddress || '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Distance:</span>
                                <span className="detail-value">{selectedDelivery.distanceKm ? `${selectedDelivery.distanceKm.toFixed(2)} km` : '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">ETA:</span>
                                <span className="detail-value">{selectedDelivery.estimatedTimeMinutes ? `${selectedDelivery.estimatedTimeMinutes} min` : '-'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Assigned At:</span>
                                <span className="detail-value">{formatDate(selectedDelivery.assignedAt)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Picked Up At:</span>
                                <span className="detail-value">{formatDate(selectedDelivery.pickedUpAt)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Delivered At:</span>
                                <span className="detail-value">{formatDate(selectedDelivery.deliveredAt)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Notes:</span>
                                <span className="detail-value">{selectedDelivery.notes || '-'}</span>
                            </div>
                            {selectedDelivery.trackingUrl && (
                                <div className="detail-row">
                                    <span className="detail-label">Tracking:</span>
                                    <a href={selectedDelivery.trackingUrl} target="_blank" rel="noopener noreferrer" className="tracking-link">
                                        Open Map
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>

            <style>{`
        .search-panel {
          background: rgba(30, 30, 46, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .search-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--gray-300);
        }

        .search-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-row .form-input {
          max-width: 200px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gray-300);
          cursor: pointer;
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          accent-color: var(--primary);
        }

        .api-reference {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius);
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .api-reference summary {
          cursor: pointer;
          font-weight: 600;
          color: var(--primary-light);
        }

        .api-list {
          margin-top: 1rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 0.5rem;
        }

        .api-item {
          font-size: 0.8rem;
          color: var(--gray-400);
          font-family: monospace;
        }

        .method {
          display: inline-block;
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          margin-right: 0.4rem;
        }

        .method.get { background: rgba(16, 185, 129, 0.2); color: var(--success); }
        .method.post { background: rgba(59, 130, 246, 0.2); color: var(--info); }
        .method.put { background: rgba(245, 158, 11, 0.2); color: var(--warning); }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: var(--gray-400);
          font-size: 0.9rem;
        }

        .delivery-card {
          display: flex;
          flex-direction: column;
        }

        .delivery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .delivery-id {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--light);
        }

        .delivery-details {
          flex: 1;
          margin-bottom: 1rem;
        }

        .delivery-info {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .info-label {
          color: var(--gray-500);
          flex-shrink: 0;
        }

        .info-value {
          color: var(--gray-300);
          word-break: break-word;
        }

        .tracking-link {
          color: var(--primary-light);
          text-decoration: underline;
        }

        .tracking-link:hover {
          color: var(--primary);
        }

        .delivery-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-info {
          background: var(--info);
          color: white;
        }

        .detail-grid {
          display: grid;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          gap: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .detail-label {
          color: var(--gray-500);
          font-weight: 500;
          min-width: 100px;
        }

        .detail-value {
          color: var(--gray-300);
          word-break: break-word;
        }
      `}</style>
        </div>
    );
}

export default Deliveries;
