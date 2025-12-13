import { useState, useEffect } from 'react';
import restaurantApi from '../api/restaurantApi';
import menuApi from '../api/menuApi';
import menuItemApi from '../api/menuItemApi';
import Modal from '../components/Modal';

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Restaurant Modal
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [restaurantForm, setRestaurantForm] = useState({
        name: '', address: '', phoneNumber: '', email: '', description: '',
    });

    // Menu Modal
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState(null);
    const [menuForm, setMenuForm] = useState({ name: '', description: '' });

    // Menu Item Modal
    const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState(null);
    const [selectedMenuForItem, setSelectedMenuForItem] = useState(null);
    const [menuItemForm, setMenuItemForm] = useState({ name: '', description: '', price: '' });

    // View Menus/Items Modal
    const [isViewMenusOpen, setIsViewMenusOpen] = useState(false);
    const [viewingRestaurant, setViewingRestaurant] = useState(null);
    const [menus, setMenus] = useState([]);
    const [menuItems, setMenuItems] = useState({});
    const [expandedMenus, setExpandedMenus] = useState({});

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const data = await restaurantApi.getAll();
            setRestaurants(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch restaurants. Make sure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const extractIdFromLink = (link) => {
        if (!link) return null;
        const parts = link.split('/');
        return parts[parts.length - 1];
    };

    const getRestaurantId = (restaurant) => {
        return restaurant.id || extractIdFromLink(restaurant._links?.self?.href);
    };

    // ========== Restaurant CRUD ==========
    const openRestaurantModal = (restaurant = null) => {
        setEditingRestaurant(restaurant);
        setRestaurantForm(restaurant ? {
            name: restaurant.name || '',
            address: restaurant.address || '',
            phoneNumber: restaurant.phoneNumber || '',
            email: restaurant.email || '',
            description: restaurant.description || '',
        } : { name: '', address: '', phoneNumber: '', email: '', description: '' });
        setIsRestaurantModalOpen(true);
    };

    const handleRestaurantSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRestaurant) {
                await restaurantApi.update(getRestaurantId(editingRestaurant), restaurantForm);
            } else {
                await restaurantApi.create(restaurantForm);
            }
            setIsRestaurantModalOpen(false);
            fetchRestaurants();
        } catch (err) {
            console.error('Error saving restaurant:', err);
            alert('Failed to save restaurant');
        }
    };

    const handleDeleteRestaurant = async (restaurant) => {
        if (!confirm('Are you sure you want to delete this restaurant?')) return;
        try {
            await restaurantApi.delete(getRestaurantId(restaurant));
            fetchRestaurants();
        } catch (err) {
            console.error('Error deleting restaurant:', err);
            alert('Failed to delete restaurant');
        }
    };

    // ========== View Menus & Items ==========
    const openViewMenus = async (restaurant) => {
        setViewingRestaurant(restaurant);
        setIsViewMenusOpen(true);
        await fetchMenus(restaurant);
    };

    const fetchMenus = async (restaurant) => {
        try {
            const restaurantId = getRestaurantId(restaurant);
            const restaurantMenusUrl = restaurant._links?.menus?.href || `/restaurant-service/restaurants/${restaurantId}/menus`;

            // Fetch menus linked to this restaurant
            const response = await fetch(`http://localhost:8080${restaurantMenusUrl.replace('http://localhost:8080', '')}`);
            const data = await response.json();
            const menuList = data._embedded?.menus || [];
            setMenus(menuList);

            // Fetch menu items for each menu
            const itemsMap = {};
            for (const menu of menuList) {
                const menuId = menu.id || extractIdFromLink(menu._links?.self?.href);
                try {
                    const items = await menuApi.getMenuItems(menuId);
                    itemsMap[menuId] = items;
                } catch {
                    itemsMap[menuId] = [];
                }
            }
            setMenuItems(itemsMap);
        } catch (err) {
            console.error('Error fetching menus:', err);
            setMenus([]);
        }
    };

    // ========== Menu CRUD ==========
    const openMenuModal = (restaurant, menu = null) => {
        setSelectedRestaurantForMenu(restaurant);
        setEditingMenu(menu);
        setMenuForm(menu ? {
            name: menu.name || '',
            description: menu.description || '',
        } : { name: '', description: '' });
        setIsMenuModalOpen(true);
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        try {
            const restaurantId = getRestaurantId(selectedRestaurantForMenu);
            const restaurantUrl = `http://localhost:8080/restaurant-service/restaurants/${restaurantId}`;

            if (editingMenu) {
                const menuId = editingMenu.id || extractIdFromLink(editingMenu._links?.self?.href);
                await menuApi.update(menuId, { ...menuForm, restaurant: restaurantUrl });
            } else {
                await menuApi.create({ ...menuForm, restaurant: restaurantUrl });
            }
            setIsMenuModalOpen(false);
            if (viewingRestaurant) {
                await fetchMenus(viewingRestaurant);
            }
        } catch (err) {
            console.error('Error saving menu:', err);
            alert('Failed to save menu');
        }
    };

    const handleDeleteMenu = async (menu) => {
        if (!confirm('Are you sure you want to delete this menu?')) return;
        try {
            const menuId = menu.id || extractIdFromLink(menu._links?.self?.href);
            await menuApi.delete(menuId);
            if (viewingRestaurant) {
                await fetchMenus(viewingRestaurant);
            }
        } catch (err) {
            console.error('Error deleting menu:', err);
            alert('Failed to delete menu');
        }
    };

    // ========== Menu Item CRUD ==========
    const openMenuItemModal = (menu, menuItem = null) => {
        setSelectedMenuForItem(menu);
        setEditingMenuItem(menuItem);
        setMenuItemForm(menuItem ? {
            name: menuItem.name || '',
            description: menuItem.description || '',
            price: menuItem.price?.toString() || '',
        } : { name: '', description: '', price: '' });
        setIsMenuItemModalOpen(true);
    };

    const handleMenuItemSubmit = async (e) => {
        e.preventDefault();
        try {
            const menuId = selectedMenuForItem.id || extractIdFromLink(selectedMenuForItem._links?.self?.href);
            const menuUrl = `http://localhost:8080/restaurant-service/menus/${menuId}`;

            if (editingMenuItem) {
                const itemId = editingMenuItem.id || extractIdFromLink(editingMenuItem._links?.self?.href);
                await menuItemApi.update(itemId, {
                    ...menuItemForm,
                    price: parseFloat(menuItemForm.price),
                    menu: menuUrl,
                });
            } else {
                await menuItemApi.create({
                    ...menuItemForm,
                    price: parseFloat(menuItemForm.price),
                    menu: menuUrl,
                });
            }
            setIsMenuItemModalOpen(false);
            if (viewingRestaurant) {
                await fetchMenus(viewingRestaurant);
            }
        } catch (err) {
            console.error('Error saving menu item:', err);
            alert('Failed to save menu item');
        }
    };

    const handleDeleteMenuItem = async (menuItem) => {
        if (!confirm('Are you sure you want to delete this menu item?')) return;
        try {
            const itemId = menuItem.id || extractIdFromLink(menuItem._links?.self?.href);
            await menuItemApi.delete(itemId);
            if (viewingRestaurant) {
                await fetchMenus(viewingRestaurant);
            }
        } catch (err) {
            console.error('Error deleting menu item:', err);
            alert('Failed to delete menu item');
        }
    };

    const toggleMenuExpand = (menuId) => {
        setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
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
                    <h1 className="page-title">🍽️ Restaurants</h1>
                    <button className="btn btn-primary" onClick={() => openRestaurantModal()}>
                        + Add Restaurant
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {restaurants.length === 0 ? (
                    <div className="empty-state">
                        <h3>No restaurants found</h3>
                        <p>Add your first restaurant to get started</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {restaurants.map((restaurant, index) => {
                            const id = getRestaurantId(restaurant);
                            return (
                                <div className="card restaurant-card" key={id || index}>
                                    <div className="restaurant-header">
                                        <h3 className="restaurant-name">{restaurant.name}</h3>
                                    </div>
                                    <div className="restaurant-details">
                                        {restaurant.address && (
                                            <p className="restaurant-info">
                                                <span className="info-icon">📍</span> {restaurant.address}
                                            </p>
                                        )}
                                        {restaurant.phoneNumber && (
                                            <p className="restaurant-info">
                                                <span className="info-icon">📞</span> {restaurant.phoneNumber}
                                            </p>
                                        )}
                                        {restaurant.email && (
                                            <p className="restaurant-info">
                                                <span className="info-icon">✉️</span> {restaurant.email}
                                            </p>
                                        )}
                                        {restaurant.description && (
                                            <p className="restaurant-description">{restaurant.description}</p>
                                        )}
                                    </div>
                                    <div className="restaurant-actions">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => openViewMenus(restaurant)}
                                        >
                                            📋 Menus
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => openRestaurantModal(restaurant)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteRestaurant(restaurant)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Restaurant Modal */}
                <Modal
                    isOpen={isRestaurantModalOpen}
                    onClose={() => setIsRestaurantModalOpen(false)}
                    title={editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}
                >
                    <form onSubmit={handleRestaurantSubmit}>
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input type="text" name="name" className="form-input" value={restaurantForm.name}
                                onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                                required placeholder="Restaurant name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input type="text" name="address" className="form-input" value={restaurantForm.address}
                                onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                                placeholder="123 Main St" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input type="text" name="phoneNumber" className="form-input" value={restaurantForm.phoneNumber}
                                onChange={(e) => setRestaurantForm({ ...restaurantForm, phoneNumber: e.target.value })}
                                placeholder="+1 234 567 890" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" className="form-input" value={restaurantForm.email}
                                onChange={(e) => setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                                placeholder="restaurant@example.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-input" value={restaurantForm.description}
                                onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                                rows="3" placeholder="Describe the restaurant..." />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsRestaurantModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{editingRestaurant ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </Modal>

                {/* View Menus Modal */}
                <Modal
                    isOpen={isViewMenusOpen}
                    onClose={() => setIsViewMenusOpen(false)}
                    title={`📋 Menus - ${viewingRestaurant?.name}`}
                >
                    <div className="menus-container">
                        <button className="btn btn-primary btn-sm mb-1" onClick={() => openMenuModal(viewingRestaurant)}>
                            + Add Menu
                        </button>

                        {menus.length === 0 ? (
                            <div className="empty-state-small">No menus yet. Add one!</div>
                        ) : (
                            <div className="menus-list">
                                {menus.map((menu) => {
                                    const menuId = menu.id || extractIdFromLink(menu._links?.self?.href);
                                    const items = menuItems[menuId] || [];
                                    const isExpanded = expandedMenus[menuId];

                                    return (
                                        <div className="menu-card" key={menuId}>
                                            <div className="menu-header" onClick={() => toggleMenuExpand(menuId)}>
                                                <div className="menu-info">
                                                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                                                    <h4 className="menu-name">{menu.name}</h4>
                                                    <span className="items-count">({items.length} items)</span>
                                                </div>
                                                <div className="menu-actions" onClick={(e) => e.stopPropagation()}>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => openMenuModal(viewingRestaurant, menu)}>Edit</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMenu(menu)}>Delete</button>
                                                </div>
                                            </div>
                                            {menu.description && <p className="menu-description">{menu.description}</p>}

                                            {isExpanded && (
                                                <div className="menu-items-section">
                                                    <div className="menu-items-header">
                                                        <span>Menu Items</span>
                                                        <button className="btn btn-sm btn-primary" onClick={() => openMenuItemModal(menu)}>+ Add Item</button>
                                                    </div>
                                                    {items.length === 0 ? (
                                                        <p className="no-items">No items in this menu</p>
                                                    ) : (
                                                        <div className="menu-items-list">
                                                            {items.map((item) => {
                                                                const itemId = item.id || extractIdFromLink(item._links?.self?.href);
                                                                return (
                                                                    <div className="menu-item" key={itemId}>
                                                                        <div className="item-info">
                                                                            <span className="item-name">{item.name}</span>
                                                                            <span className="item-price">${item.price?.toFixed(2)}</span>
                                                                        </div>
                                                                        {item.description && <p className="item-description">{item.description}</p>}
                                                                        <div className="item-actions">
                                                                            <button className="btn btn-xs btn-secondary" onClick={() => openMenuItemModal(menu, item)}>Edit</button>
                                                                            <button className="btn btn-xs btn-danger" onClick={() => handleDeleteMenuItem(item)}>Delete</button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Modal>

                {/* Menu Modal */}
                <Modal
                    isOpen={isMenuModalOpen}
                    onClose={() => setIsMenuModalOpen(false)}
                    title={editingMenu ? 'Edit Menu' : 'Add Menu'}
                >
                    <form onSubmit={handleMenuSubmit}>
                        <div className="form-group">
                            <label className="form-label">Menu Name *</label>
                            <input type="text" className="form-input" value={menuForm.name}
                                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                                required placeholder="e.g., Breakfast, Lunch, Dinner" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" value={menuForm.description}
                                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                                rows="2" placeholder="Menu description..." />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsMenuModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{editingMenu ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </Modal>

                {/* Menu Item Modal */}
                <Modal
                    isOpen={isMenuItemModalOpen}
                    onClose={() => setIsMenuItemModalOpen(false)}
                    title={editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
                >
                    <form onSubmit={handleMenuItemSubmit}>
                        <div className="form-group">
                            <label className="form-label">Item Name *</label>
                            <input type="text" className="form-input" value={menuItemForm.name}
                                onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                                required placeholder="e.g., Margherita Pizza" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" value={menuItemForm.description}
                                onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                                rows="2" placeholder="Item description..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price *</label>
                            <input type="number" step="0.01" min="0" className="form-input" value={menuItemForm.price}
                                onChange={(e) => setMenuItemForm({ ...menuItemForm, price: e.target.value })}
                                required placeholder="9.99" />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsMenuItemModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{editingMenuItem ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </Modal>
            </div>

            <style>{`
        .restaurant-card {
          display: flex;
          flex-direction: column;
        }
        .restaurant-header { margin-bottom: 1rem; }
        .restaurant-name { font-size: 1.25rem; font-weight: 600; color: var(--light); }
        .restaurant-details { flex: 1; margin-bottom: 1rem; }
        .restaurant-info { display: flex; align-items: center; gap: 0.5rem; color: var(--gray-400); font-size: 0.9rem; margin-bottom: 0.5rem; }
        .info-icon { font-size: 1rem; }
        .restaurant-description { color: var(--gray-500); font-size: 0.9rem; margin-top: 0.75rem; font-style: italic; }
        .restaurant-actions { display: flex; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        
        .menus-container { max-height: 60vh; overflow-y: auto; }
        .mb-1 { margin-bottom: 1rem; }
        .empty-state-small { padding: 1rem; text-align: center; color: var(--gray-500); }
        .menus-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
        
        .menu-card { background: rgba(30, 30, 46, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius); padding: 1rem; }
        .menu-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .menu-info { display: flex; align-items: center; gap: 0.5rem; }
        .expand-icon { color: var(--gray-500); font-size: 0.8rem; }
        .menu-name { font-size: 1rem; font-weight: 600; color: var(--light); margin: 0; }
        .items-count { color: var(--gray-500); font-size: 0.85rem; }
        .menu-actions { display: flex; gap: 0.5rem; }
        .menu-description { color: var(--gray-500); font-size: 0.85rem; margin: 0.5rem 0 0; }
        
        .menu-items-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .menu-items-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; color: var(--gray-400); font-weight: 500; }
        .no-items { color: var(--gray-500); font-size: 0.85rem; font-style: italic; }
        .menu-items-list { display: flex; flex-direction: column; gap: 0.5rem; }
        
        .menu-item { background: rgba(0, 0, 0, 0.2); border-radius: var(--radius-sm); padding: 0.75rem; }
        .item-info { display: flex; justify-content: space-between; align-items: center; }
        .item-name { font-weight: 500; color: var(--light); }
        .item-price { color: var(--success); font-weight: 600; }
        .item-description { color: var(--gray-500); font-size: 0.8rem; margin: 0.25rem 0 0.5rem; }
        .item-actions { display: flex; gap: 0.5rem; }
        
        .btn-xs { padding: 0.2rem 0.5rem; font-size: 0.75rem; }
      `}</style>
        </div>
    );
}

export default Restaurants;
