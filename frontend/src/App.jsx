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

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="flex">
					<NavBar />
					<div className="flex-1">
						<Header />
						<main className="mt-16 ml-64 p-6">
							<Routes>
								<Route path="/" element={<Home />} />
								<Route element={<PrivateRoute />}>
									<Route path="/dashboard" element={<Dashboard />} />
									<Route path="/accounts" element={<Accounts />} />
									<Route path="/transactions" element={<Transactions />} />
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
