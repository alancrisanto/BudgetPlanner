// src/components/NavBar.jsx
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Wallet, Banknote } from 'lucide-react';
import Dashboard from '../pages/Dashboard';

const NavBar = () => {

    const location = useLocation();
    const currentPath = location.pathname;

    const linkClass = (path) =>
        `block px-4 py-2 rounded hover:bg-gray-700 transition ${
        currentPath === path ? 'bg-gray-500 text-white font-semibold' : 'text-white'
        }`;

    return (
        <div className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col shadow-lg pt-16">
            <nav className="flex-1 space-y-1 px-2">
                <Link to="/" className={linkClass('/')}>
                    <div className="flex items-center gap-2"><Home size={18} />Home</div></Link>
                <Link to="/dashboard" className={linkClass('/dashboard')}>
                    <div className="flex items-center gap-2"><LayoutDashboard size={18} />Dashboard</div></Link>
                <Link to="/accounts" className={linkClass('/accounts')}>
                    <div className="flex items-center gap-2"><Wallet size={18} />Accounts</div></Link>
                <Link to="/transactions" className={linkClass('/transactions')}>
                    <div className="flex items-center gap-2"><Banknote size={18} />Transactions</div></Link>
            </nav>
        </div>
    );
};

export default NavBar;
