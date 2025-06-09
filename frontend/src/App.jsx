import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PreferencesProvider } from "./context/PreferencesContext";

import PrivateRoute from "./PrivateRoute";
import NavBar from "./components/NavBar";
import Header from "./components/Header";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings"
import AccountDetails from "./pages/AccountDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { useState } from "react";

function AppLayout() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const { isAuthenticated, loading } = useAuth();

	if (loading) return null;

	return (
		<div className="flex">
			{isAuthenticated && (
				<NavBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
			)}

			<div className="flex-1">

				<Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />


				<main className={isAuthenticated ? "mt-16 px-4 sm:ml-64" : "px-4"}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route element={<PrivateRoute />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/accounts" element={<Accounts />} />
							<Route path="/transactions" element={<Transactions />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/accounts/:id" element={<AccountDetails />} />
						</Route>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/forgot-password" element={<ForgotPassword />} />
						<Route path="/reset-password/:token" element={<ResetPassword />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<PreferencesProvider>
			<AuthProvider>
				<Router>
					<AppLayout />
				</Router>
			</AuthProvider>
		</PreferencesProvider>
	);
}
