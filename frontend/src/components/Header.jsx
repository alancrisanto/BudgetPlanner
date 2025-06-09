import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Header = ({ mobileOpen, setMobileOpen }) => {
	const { isAuthenticated, logout } = useAuth();

	return (
		<header className={`bg-black h-16 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-30 ${isAuthenticated ? 'sm:ml-64' : ''}`}>

			<div className="h-full flex items-center px-4 sm:px-6 gap-4">
				{/* Hamburger for mobile */}
				<div className="sm:hidden">
					<button
						onClick={() => setMobileOpen(!mobileOpen)}
						className="text-white p-2"
						aria-label="Toggle navigation"
					>
						{mobileOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				<Link to="/" className="text-white font-semibold text-lg hover:no-underline flex items-center gap-2">
					💰 Budget Planner
				</Link>

			</div>

			<div className="flex-1 flex justify-end items-center px-4 sm:px-6 gap-4">
				{isAuthenticated ? (
					<Link
						onClick={logout}
						to="/login"
						className="text-white px-4 py-2 rounded border hover:bg-gray-500 transition"
					>
						Logout
					</Link>
				) : (
					<>
						<Link to="/login" className="text-white px-4 py-2 rounded border hover:bg-gray-500 transition">
							Login
						</Link>
						<Link to="/register" className="text-white px-4 py-2 rounded hover:bg-gray-500 transition">
							Register
						</Link>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;
