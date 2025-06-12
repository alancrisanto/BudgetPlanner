import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ExpenseIncomeChart from '../components/charts/ExpenseIncomeChart';
import CategoriesChart from '../components/charts/CategoriesChart';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { usePreferences } from '../context/PreferencesContext';

const VITE_API_URL = import.meta.env.VITE_API_URL;

function AccountDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const { currencySymbol } = usePreferences();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        account_id: id,
        type: '',
        date: '',
        name: '',
        amount: '',
        category_id: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchAccount = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/accounts/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
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
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const sorted = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setTransactions(sorted);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching transactions');
            }
        };
        fetchTransactions();
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${VITE_API_URL}/api/categories`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setCategories(res.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();

    }, [id, user.token, isAuthenticated]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!formData.type) errors.type = 'Transaction type is required.';
        if (!formData.date) errors.date = 'Date is required.';
        if (!formData.name) errors.name = 'Name is required.';
        if (!formData.amount || parseFloat(formData.amount) <= 0) errors.amount = 'Valid amount required.';
        if (!formData.category_id) errors.category_id = 'Category is required.';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const res = await axios.post(`${VITE_API_URL}/api/transactions`, {
                ...formData,
                amount: parseFloat(formData.amount),
                account_id: id,
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            setTransactions([...transactions, res.data]);
            setFormData({
                account_id: id,
                type: '',
                date: '',
                name: '',
                amount: '',
                category_id: ''
            });
            setShowModal(false);
        } catch (err) {
            console.error('Error submitting transaction:', err);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const closeDeleteModal = () => setShowDeleteModal(false);
    const handleDelete = async () => {
        try {
            await axios.delete(`${VITE_API_URL}/api/accounts/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            navigate('/accounts');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error deleting account');
        } finally {
            closeDeleteModal();
        }
    };

    const [showEditModal, setShowEditModal] = useState(false);
    const closeEditModal = () => setShowEditModal(false);
    const handleEdit = async () => {
        try {
            await axios.put(`${VITE_API_URL}/api/accounts/${id}`, { name: account.name }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setShowEditModal(false);
            setAccount({ ...account, name: account.name });
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error updating account');
        }
    };

    const totalIncome = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc, 0);
    const totalExpenses = transactions.reduce((acc, t) => t.type === 'expense' ? acc + t.amount : acc, 0);

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
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 whitespace-nowrap">
                            Add Transaction
                        </button>
                    </div>

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
                                <span className="text-green-600 font-semibold">{currencySymbol}{totalIncome.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-800">Total Expenses</span>
                                <span className="text-red-600 font-semibold">{currencySymbol}{totalExpenses.toFixed(2) || '0.00'}</span>
                            </div>
                            <hr className="my-2 border-gray-200" />
                            <div className="flex justify-between pt-2">
                                <span className="font-medium text-gray-800">Remainder</span>
                                <span className="font-semibold">{currencySymbol}{(totalIncome - totalExpenses).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Expenses and Income</h2>
                            <ExpenseIncomeChart transactions={transactions} />
                        </div>
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h2>
                            <CategoriesChart transactions={transactions} />
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Transactions</h2>
                        {transactions.length > 0 ? (
                            <ul className="space-y-4">
                                {transactions.map((transaction) => (
                                    <li key={transaction._id} className="flex justify-between items-start p-3 rounded-md hover:bg-gray-100 transition-transform duration-200 hover:scale-[1.01]">
                                        <div>
                                            <span className="font-medium text-gray-800">{transaction.name}</span>
                                            <div className="text-sm text-gray-600">{transaction.category_id?.name || 'No category'}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-base font-semibold text-gray-900">{(transaction.type === 'income' ? '+' : '-')}{currencySymbol}{transaction.amount.toFixed(2)}</div>
                                            <div className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500">No transactions found for this account.</div>
                        )}
                    </div>

                    <div>
                        <button onClick={() => navigate('/accounts')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md px-4 py-2">Back to Accounts</button>
                    </div>
                </div>
            )}

            <Modal isOpen={showEditModal} onClose={closeEditModal} title="Edit Account Name">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Account Name</label>
                    <input type="text" value={account?.name || ''} onChange={(e) => setAccount({ ...account, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="flex justify-end gap-4">
                        <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showDeleteModal} title="Delete Account" onClose={closeDeleteModal}>
                <div className="space-y-4">
                    <p>Are you sure you want to delete this account? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4">
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Transaction">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Type</label>
                        <select className="w-full border border-gray-300 rounded p-2"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required>
                            <option value="">Select</option>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                        {formErrors.type && <p className="text-red-500 text-xs">{formErrors.type}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Date</label>
                        <input type="date" className="w-full border border-gray-300 rounded p-2"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required />
                        {formErrors.date && <p className="text-red-500 text-xs">{formErrors.date}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded p-2"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required />
                        {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Amount</label>
                        <input type="number" step="0.01" className="w-full border border-gray-300 rounded p-2"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required />
                        {formErrors.amount && <p className="text-red-500 text-xs">{formErrors.amount}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Category</label>
                        <select className="w-full border border-gray-300 rounded p-2"
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            required>
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        {formErrors.category_id && <p className="text-red-500 text-xs">{formErrors.category_id}</p>}
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                            Save Transaction
                        </button>
                    </div>
                </form>
            </Modal>

        </div>

    );
}

export default AccountDetails;
