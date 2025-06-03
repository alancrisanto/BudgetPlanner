import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ExpenseIncomeChart from '../components/charts/ExpenseIncomeChart';
import CategoriesChart from '../components/charts/CategoriesChart';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

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

    const [selectedDate, setSelectedDate] = useState(new Date());
    // Format current month and year for display
    const currentMonthYear = selectedDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
    // Get previous and next month for navigation
    const previousMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);

    useEffect(() => {
        if (!isAuthenticated) { return; }
        // Fetch account details
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
        // Fetch transactions for the account
        const fetchTransactions = async () => {   
            try {
                const response = await axios.get(`${VITE_API_URL}/api/transactions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                // Filter transactions for the current (by default) or chosen month and year
                const selectedMonth = selectedDate.getMonth();
                const selectedYear = selectedDate.getFullYear();
                // Filter transactions by selected month and year
                const filteredTransactions = response.data.filter((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
                });
                // Sort transactions by date
                const sortedTransactions = filteredTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
                setTransactions(sortedTransactions);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching transactions');
            }
        };
        fetchTransactions();
    }, [id, user.token, isAuthenticated, selectedDate]);

    // Handle delete account
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const closeDeleteModal = () => setShowDeleteModal(false);
    const handleDelete = async () => {
        try {
            await axios.delete(`${VITE_API_URL}/api/accounts/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            navigate('/accounts');
        }
        catch (err) {
            setError(err.response ? err.response.data.message : 'Error deleting account');
        } finally {
            closeDeleteModal();
        }
    }

    // Handle edit account name
    const [showEditModal, setShowEditModal] = useState(false);
    const closeEditModal = () => setShowEditModal(false);
    const handleEdit = async () => {
        try {
            await axios.put(`${VITE_API_URL}/api/accounts/${id}`, { name: account.name }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setShowEditModal(false);
            setAccount({ ...account, name: account.name });
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error updating account');
        }
    }

    // Disable next button if selected date is in the future
    const disableNextButton = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        return selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth);
    };

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
                {/* Current Month */}
                <div className="flex justify-center items-center gap-4">
                    <button onClick={() => setSelectedDate(previousMonth)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">← </button>
                    <span className="text-gray-800 font-semibold">{currentMonthYear}</span>
                    <button onClick={() => setSelectedDate(nextMonth)} disabled={disableNextButton()} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">→</button>
                </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Account Summary</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setShowEditModal(true)} className="hover:text-blue-700">
                            <Pencil size={16} />
                        </button>
                        <button onClick={() => setShowDeleteModal(true)} className="hover:text-red-700">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
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
                    <ExpenseIncomeChart transactions={transactions} selectedDate={selectedDate} />
                </div>

                {/* Categories Chart */}
                <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Expenses by Category</h2>
                    <CategoriesChart transactions={transactions} selectedDate={selectedDate} />
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

        {/* Modal for editing account name */}
        <Modal isOpen={showEditModal} onClose={closeEditModal} title="Edit Account Name">
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Account Name
                </label>
                <input
                    type="text"
                    value={account?.name || ''}
                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-4">
                    <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save
                    </button>
                </div>
            </div>
        </Modal>

        {/* Modal for confirming account deletion */}
        <Modal isOpen={showDeleteModal} title="Delete Account" onClose={closeDeleteModal}>
            <div className="space-y-4">
                <p>Are you sure you want to delete this account? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
</div>

);

}

export default AccountDetails;