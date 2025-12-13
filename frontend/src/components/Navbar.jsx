import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <NavLink to="/" className="navbar-brand">
                    <span className="brand-icon">🍕</span>
                    <span className="brand-text">FoodDelivery</span>
                </NavLink>

                <div className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Home
                    </NavLink>
                    <NavLink to="/restaurants" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Restaurants
                    </NavLink>
                    <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Orders
                    </NavLink>
                    <NavLink to="/deliveries" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Deliveries
                    </NavLink>
                    <NavLink to="/notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Ratings
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
