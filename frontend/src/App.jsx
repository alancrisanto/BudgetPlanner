import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import { useState } from "react";
function App() {
	const [mobileOpen, setMobileOpen] = useState(false);


	return (
		<AuthProvider>
			<Router>
				<div className="flex">
					<NavBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

					<div className="flex-1">
						<Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

						<main className="mt-16 px-4 sm:ml-64">

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

							</Routes>
						</main>
					</div>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;