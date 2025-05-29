import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Wallet, Banknote, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavBar = ({ mobileOpen, setMobileOpen }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const menuRef = useRef();
    const { isAuthenticated } = useAuth();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        };
        if (mobileOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileOpen]);

    const linkClass = (path) =>
        `block px-4 py-2 rounded hover:bg-gray-700 transition ${currentPath === path ? 'bg-gray-500 text-white font-semibold' : 'text-white'
        }`;

    const navLinks = (
        <nav className="space-y-1 px-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className={linkClass('/')}>
                <div className="flex items-center gap-2"><Home size={18} />Home</div>
            </Link>
            {isAuthenticated && (
                <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={linkClass('/dashboard')}>
                        <div className="flex items-center gap-2"><LayoutDashboard size={18} />Dashboard</div>
                    </Link>
                    <Link to="/accounts" onClick={() => setMobileOpen(false)} className={linkClass('/accounts')}>
                        <div className="flex items-center gap-2"><Wallet size={18} />Accounts</div>
                    </Link>
                    <Link to="/transactions" onClick={() => setMobileOpen(false)} className={linkClass('/transactions')}>
                        <div className="flex items-center gap-2"><Banknote size={18} />Transactions</div>
                    </Link>

                </>
            )}
        </nav>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden sm:flex w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex-col shadow-lg pt-16">
                <div className="flex flex-col flex-grow">
                    {navLinks}
                </div>
                <div className="px-4 pb-4 mt-auto border-t border-gray-700">
                    <Link to="/settings" onClick={() => setMobileOpen(false)} className="block py-3 text-sm hover:text-blue-400">
                        <div className="flex items-center gap-2">
                            <Settings size={18} /> Settings
                        </div>
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">&copy; {new Date().getFullYear()} BudgetPlanner</p>
                </div>
            </div>

            {/* Mobile Slideout Menu */}
            <div
                ref={menuRef}
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg transform transition-transform z-40 sm:hidden pt-16 flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col flex-grow">
                    {navLinks}
                </div>
                <div className="px-4 pb-4 mt-auto border-t border-gray-700">
                    <Link to="/settings" onClick={() => setMobileOpen(false)} className="block py-3 text-sm hover:text-blue-400">
                        <div className="flex items-center gap-2">
                            <Settings size={18} /> Settings
                        </div>
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">&copy; {new Date().getFullYear()} BudgetPlanner CSE499</p>
                </div>
            </div>
        </>
    );

};

export default NavBar;
