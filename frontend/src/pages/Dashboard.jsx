import Dashcoins from "../components/DashCoins";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import ExpPerAcctChart from '../components/charts/ExpPerAcctChart';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
	const user = JSON.parse(localStorage.getItem("user"));

	const { isAuthenticated } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [accounts, setAccounts] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [recentTransactions, setRecentTransactions] = useState([]);

	useEffect(() => {
		if (!isAuthenticated) { return; }

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
	}, [isAuthenticated, user]);

	return (
		<div>
			<div className="flex gap-4 items-center pt-6">
				<h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
					Welcome back <strong className="text-indigo-600"> {user ? user.user.email : "User"} </strong>
				</h2>
				<img className="max-w-[48px] animate-bounce" src="/money-wings.svg" alt="" />
			</div>
			<p className="text-gray-700">This is your Financial Overview Report</p>
			<Dashcoins />

			{loading ? (
				<div className="flex items-center justify-center h-64">
					<p className="text-gray-500">Loading...</p>
				</div>
			) : error ? (
				<div className="flex items-center justify-center h-64">
					<p className="text-red-500">{error}</p>
				</div>
			) : accounts.length > 0 ? (
				<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mt-6">
					{/* Display balances of accounts */}
					<h3 className="text-xl font-semibold mb-4">Balances Accounts</h3>
					{accounts.map((account) => (
						<div key={account._id} className="flex justify-between items-center py-2">
							<span className="text-lg font-semibold">{account.name}</span>
							<span className={`text-lg font-medium ${
								account.remainder < 0 ? 'text-red-600' : 'text-gray-700'}`}>${account.remainder.toFixed(2)}</span>
						</div>
					))}
				</div>
			) : (
				<div className="flex items-center justify-center h-64">
				<p className="text-gray-500">No accounts found.</p>
				</div>
			)}
				<div className="mt-6 flex flex-col lg:flex-row gap-6">
					{/* Display the expenses per account chart */}
					<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full lg:w-2/3 mb-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Expenses per Account</h2>
						<ExpPerAcctChart transactions={transactions} />
					</div>

					{recentTransactions.length > 0 ? (
					<div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full lg:w-1/3 mb-6">			
					{/* Display recent transactions */}
					<h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
					<ul className="space-y-4">
						{recentTransactions.map((transaction) => (
							<li key={transaction._id}
								className="flex justify-between items-start p-3 rounded-md hover:bg-gray-100 transition-transform duration-200 hover:scale-[1.01]">
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
										{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
									</div>
									<div className="text-xs text-gray-500">
										{new Date(transaction.date).toLocaleDateString('en-US', {
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
				<div className="flex items-center justify-center h-64">
					<p className="text-gray-500">No recent transactions found.</p>
				</div>
			)}
			</div>
		</div>
	);
};

export default Dashboard;
