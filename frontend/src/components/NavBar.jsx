// src/components/NavBar.jsx
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">💰 Budget Planner</h1>
                <ul className="flex gap-4">
                    <li>
                        <Link to="/" className="hover:text-green-400">Home</Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/accounts" className="hover:text-green-400">Accounts</Link>
                    </li>
                    <li>
                        <Link to="/login" className="hover:text-green-400">Login</Link>
                    </li>
                    <li>
                        <Link to="/register" className="hover:text-green-400">Register</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
