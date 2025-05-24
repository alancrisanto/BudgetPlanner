import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-black h-16 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-10">
            <div className="w-64 h-full flex items-center px-6 border-yellow-700">
            <h1 className="text-white font-semibold text-lg flex items-center gap-2">
                💰 Budget Planner
            </h1>
            </div>

            <div className="flex-1 flex justify-end items-center px-6">
                <Link to="/login" className="text-white px-4 py-2 rounded border hover:bg-gray-500 transition">Login</Link>
                <Link to="/register" className="text-white px-4 py-2 rounded hover:bg-gray-500 transition">Register</Link>
            </div>
        </header>
    );
};

export default Header;