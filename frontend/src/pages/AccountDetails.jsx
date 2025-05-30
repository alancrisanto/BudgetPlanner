import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ExpenseIncomeChart from '../components/charts/ExpenseIncomeChart';
import CategoriesChart from '../components/charts/CategoriesChart';

const VITE_API_URL = import.meta.env.VITE_API_URL;

function AccountDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ transactions, setTransactions ] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) { return; }

        const fetchAccount = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/accounts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setAccount(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching account');
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, [id, user.token, isAuthenticated]);

    useEffect(() => {
        const fetchTransactions = async () => {    
            try {
                const response = await axios.get(`${VITE_API_URL}/api/transactions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setTransactions(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching transactions');
            }
        };
        fetchTransactions();
    }, [id, user.token, isAuthenticated]);

    return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6">
    {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
    ) : error ? (
        <div className="text-center text-red-500">{error}</div>
    ) : (
        <div className="space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">{account.name}</h1>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2">
                    Edit Account
                </button>
            </div>

            {/* Account Summary */}
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Summary</h2>
                <div className="space-y-2 text-sm md:text-base text-gray-700">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-800">Total Income</span>
                        <span className="text-green-600 font-semibold">${account.income_total?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-800">Total Expenses</span>
                        <span className="text-red-600 font-semibold">${account.expense_total?.toFixed(2) || '0.00'}</span>
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="flex justify-between pt-2">
                        <span className="font-medium text-gray-800">Remainder</span>
                        <span className="font-semibold">${(Number(account.income_total || 0) - Number(account.expense_total || 0)).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense and Income Chart */}
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Expenses and Income</h2>
                    <ExpenseIncomeChart transactions={transactions} />
                </div>

                {/* Categories Chart */}
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Expenses by Category</h2>
                    <CategoriesChart transactions={transactions} />
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Transactions</h2>
                {transactions.length > 0 ? (
                    <ul className="space-y-4">
                        {transactions.map((transaction) => (
                            <li
                                key={transaction._id}
                                className="flex justify-between items-start p-3 rounded-md hover:bg-gray-100 transition-transform duration-200 hover:scale-[1.01]"
                            >
                                <div>
                                    <span className="font-medium text-gray-800">{transaction.name}</span>
                                    <div className="text-sm text-gray-600">
                                        {transaction.category_id?.name || 'No category'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-base font-semibold text-gray-900">
                                        {(transaction.type === 'income' ? '+' : '-')}${transaction.amount.toFixed(2)}
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
                ) : (
                    <div className="text-gray-500">No transactions found for this account.</div>
                )}
            </div>

            {/* Back Button */}
            <div>
                <button
                    onClick={() => navigate('/accounts')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md px-4 py-2"
                >
                    Back to Accounts
                </button>
            </div>
        </div>
    )}
</div>

);

}

export default AccountDetails;