import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Orders from './pages/Orders';
import Deliveries from './pages/Deliveries';
import Notes from './pages/Notes';
import './App.css';

function App() {
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restaurants" element={<Restaurants />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/deliveries" element={<Deliveries />} />
                    <Route path="/notes" element={<Notes />} />
                </Routes>
            </main>
            <footer className="footer">
                <div className="container">
                    <p>© 2024 Food Delivery Platform • Built with React + Spring Boot</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
