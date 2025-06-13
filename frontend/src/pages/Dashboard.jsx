import Dashcoins from "../components/DashCoins";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import ExpPerAcctChart from '../components/charts/ExpPerAcctChart';
import CategoriesAcctsChart from '../components/charts/CategoriesAcctsChart';
import CategoriesMonthsChart from '../components/charts/CategoriesMonthsChart';
import { usePreferences } from '../context/PreferencesContext';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

	const { isAuthenticated } = useAuth();
	const [loading, setLoading] = useState(true);
	const { currencySymbol } = usePreferences();
	const [error, setError] = useState(null);
	const [accounts, setAccounts] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [recentTransactions, setRecentTransactions] = useState([]);

	useEffect(() => {
		if (!isAuthenticated || !user) return;

		const fetchData = async () => {
			try {
				// Fetch accounts data
				const response = await fetch(`${VITE_API_URL}/api/accounts`, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				if (!response.ok) {
					throw new Error("Failed to fetch accounts");
				}
				const data = await response.json();
				setAccounts(data);

				// Fetch the last 10 transactions
				const transactionsResponse = await fetch(`${VITE_API_URL}/api/transactions/last`, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				if (!transactionsResponse.ok) {
					throw new Error("Failed to fetch transactions");
				}
				const transactionsData = await transactionsResponse.json();
				setRecentTransactions(transactionsData);

				// fetch all transactions for the user
				const allTransactionsResponse = await fetch(`${VITE_API_URL}/api/transactions`, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				if (!allTransactionsResponse.ok) {
					throw new Error("Failed to fetch all transactions");
				}
				const allTransactionsData = await allTransactionsResponse.json();
				setTransactions(allTransactionsData);

			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [isAuthenticated, user?.token]);

	return (
		<>
		<div className="grid grid-cols-1 gap-6 p-6 max-w-7xl mx-auto">
        	<title>DashBoard | Budget Planner</title>
				<meta name="description" content="View your financial overview — track income, expenses, savings, and budget performance in one place." />
				<meta name="keywords" content="financial dashboard, budget summary, expense overview, income tracking" />
				<meta name="author" content="Veihi Joy Tupai,  Cameron Pedro, _Rama Krishna Bhagi Perez, Bamutesiza Ronald" />

				<meta property="og:title" content="BudgetPlanner | Dashboard" />
				<meta property="og:description" content="Analyze your finances with an easy-to-read dashboard." />
				<meta property="og:url" content="" />
				<meta property="og:image" content="" />

				<meta name="twitter:card" content="" />
				<meta name="twitter:title" content="BudgetPlanner | Dashboard" />
				<meta name="twitter:description" content="Get a full view of your financial health in one place." />
				<meta name="twitter:image" content="" />

			<div className="flex gap-4 items-center pt-6">
				<h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
					Welcome back <strong className="text-indigo-600"> {user ? user.user.firstName : "User"} </strong>
				</h2>
				<img className="max-w-[48px] animate-bounce" src="/money-wings.svg" alt="" />
			</div>
			<p className="text-gray-700">This is your Financial Overview Report</p>


			{loading ? (
				<div className="flex items-center justify-center h-64">
					<p className="text-gray-500">Loading...</p>
				</div>
			) : error ? (
				<div className="flex items-center justify-center h-64">
					<p className="text-red-500">{error}</p>
				</div>
			) : (
					<div className="flex flex-col lg:flex-row gap-6 mt-6">
						{/* Balances Card */}
						{accounts.length > 0 ? (
							<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex-1">
								<h3 className="text-xl font-semibold mb-4">My Accounts</h3>
								{accounts.map((account) => (
									<div key={account._id} className="flex justify-between items-start py-4">
										{/* Account name on the left */}
										<div className="text-lg font-medium text-gray-800 w-1/2">
											{account.name}
										</div>

										{/* Numbers on the right */}
										<div className="text-right w-1/2">
											<p className="text-base font-medium text-green-500">{currencySymbol}{account.income_total.toFixed(2)}</p>
											<p className="text-base font-medium text-red-500">{currencySymbol}{account.expense_total.toFixed(2)}</p>
											<hr className="my-2 w-24 ml-auto border-gray-300" />
											<p className="text-base font-medium">{currencySymbol}{account.remainder.toFixed(2)}</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex-1">
								<h3 className="text-xl font-semibold mb-4">My Accounts</h3>
								<p className="text-gray-500 text-center">No accounts found.</p>
							</div>
						)}

						{/* This Month Category Chart */}
						<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex-1">
							<h2 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category This Month</h2>
							<CategoriesAcctsChart transactions={transactions} />
						</div>
						{/* Previous Months Category Chart */}
						<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex-1">
							<h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Spending by Category</h2>
							<CategoriesMonthsChart transactions={transactions} />
						</div>
					</div>)}

			<div className="mt-6 flex flex-col lg:flex-row gap-6">
				{/* Daily expenses per account chart */}
				<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full lg:w-2/3 mb-6">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Expenses per Account</h2>
					<ExpPerAcctChart transactions={transactions} />
				</div>

				{recentTransactions.length > 0 ? (
					<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full lg:w-1/3 mb-6">
						{/* Display recent transactions */}
						<h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
						<ul className="space-y-3">
							{recentTransactions.map((transaction) => (
								<li key={transaction._id}
									className="flex justify-between items-start p-2 rounded-md hover:bg-gray-100 transition-transform duration-200 hover:scale-[1.01]">
									<div>
										<span className="font-medium text-gray-800">{transaction.name}</span>
										<div className="text-sm text-gray-600">
											{transaction.category_id?.name || 'No category'}
										</div>
										<div className="text-sm text-gray-500">
											{transaction.account_id?.name || 'No account'}
										</div>
									</div>
									<div className="text-right">
										<div className={"text-base font-semibold"}>
											{transaction.type === 'income' ? '+' : '-'}{currencySymbol}{transaction.amount.toFixed(2)}
										</div>
										<div className="text-xs text-gray-500">
											{new Date(transaction.date).toLocaleDateString('en-US', {
												timeZone: 'UTC',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				) : (
					<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex-1 mb-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
						<p className="text-gray-500 text-center">No recent transactions found.</p>
					</div>
				)}
			</div>
			<div className="flex flex-col lg:flex-row gap-6 mt-6">
				<Dashcoins />

				<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex-1">
					<h2>News..</h2>
				</div>
			</div>
			
		</div>
		
		
		</>
	);
};

export default Dashboard;
