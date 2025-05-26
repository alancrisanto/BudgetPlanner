import React, { use } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Transactions() {
    // Verify if the user is authenticated
    // and retrieve user information from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;
    // const accountId = localStorage.getItem('account_id');
    const accountId = import.meta.env.VITE_ACCOUNT_ID; // hardcoded until the accounts are implemented

    // State variables for transactions, loading, error, categories, form data, and modals
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        name: '',
        amount: '',
        category_id: '',
        recurring: false,
        frequency: '',
        next_date: '',
        end_date: ''
    });

    const [editTransaction, setEditTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const openModal = (transaction = null) => {
        if (transaction) {
            setEditTransaction(transaction);
            setFormData({
                type: transaction.type || 'expense',
                date: transaction.date.slice(0, 10),
                name: transaction.name,
                amount: transaction.amount,
                category_id: transaction.category_id,
                recurring: transaction.recurring || false,
                frequency: transaction.frequency || '',
                next_date: transaction.next_date ? transaction.next_date.slice(0, 10) : '',
                end_date: transaction.end_date ? transaction.end_date.slice(0, 10) : ''
            });
        } else {
            setEditTransaction(null);
            setFormData({
                type: 'expense',
                date: '',
                name: '',
                amount: '',
                category_id: '',
                recurring: false,
                frequency: '',
                next_date: '',
                end_date: ''
            });
        };
        setShowModal(true);
    }
    const closeModal = () => setShowModal(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const closeDeleteModal = () => setShowDeleteModal(false);
    const [deleteTransaction, setDeleteTransaction] = useState(null);

    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    
    useEffect(() => {
        let filteredResult = [...transactions];
        // Filter transactions based on selected filter
        if (selectedFilter === 'income' || selectedFilter === 'expense') {
            filteredResult = filteredResult.filter(transaction => transaction.type === selectedFilter);
        } 
        // Sort transactions based on selected sort criteria
        filteredResult.sort((a, b) => {
        if (sortBy === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortBy === 'amount') {
                return parseFloat(a.amount) - parseFloat(b.amount);
            } else if (sortBy === 'category') {
                return a.category_id.name.localeCompare(b.category_id.name);
            }
            return 0; // Default case, no sorting
        });
        setFilteredTransactions(filteredResult); 
    }, [transactions, selectedFilter, sortBy]); 

    // Handle search functionality
    const handleSearch = (searchTerm) => {
        // Filter transactions based on search term
        const filtered = transactions.filter(transaction => 
            transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category_id.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTransactions(filtered);
    };

    // Fetch transactions and categories when the component mounts
    useEffect(() => {
        // Fetch transactions
        const fetchTransactions = async () => {
            // Check if user is authenticated and has a token
            if (!user) {
                setLoading(false);
                setError(new Error('User is not authenticated'));
                return;
            }
            setLoading(true);
            if (!token) {
                setLoading(false);
                setError(new Error('No authentication token found'));
                return;
            }
            // Check if accountId is available
            if (!accountId) {
                setLoading(false);
                setError(new Error('No account ID found'));
                return;
            }
            try {
                const response = await axios.get(`${VITE_API_URL}/api/transactions`, {
                params: { account_id: accountId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                });
                setTransactions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                });
                setCategories(response.data);
            } catch (err) {
                setError(err);
            }
        };
        fetchTransactions();
        fetchCategories();
    }
    , []);

    // Handle form submission for adding or editing transactions
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        // Check if all required fields are filled correctly
        if (!formData.type) errors.type = 'Please select a transaction type.';
        if (!formData.date) errors.date = 'Please select a date.';
        if (!formData.name) errors.name = 'Please enter a name.';
        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) errors.amount = 'Please enter a valid amount.';
        if (!formData.category_id) errors.category_id = 'Please select a category.';
        if (new Date(formData.date) > new Date()) errors.date = 'Date cannot be in the future.';
        if (formData.type !== 'income' && formData.type !== 'expense') errors.type = 'Invalid transaction type.';
        if (formData.recurring && !formData.frequency) errors.frequency = 'Please select a frequency for recurring transactions.';
        if (formData.recurring && formData.end_date && new Date(formData.end_date) < new Date(formData.date)) errors.end_date = 'End date cannot be before the start date.';
        if (formData.recurring && formData.next_date && new Date(formData.next_date) < new Date(formData.date)) errors.next_date = 'Next date cannot be before the start date.';
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({}); // Clear errors if no validation issues
        try {
            // Prepare form data for submission
            const formDataToSubmit = {
                ...formData,
                account_id: accountId,
                amount: parseFloat(formData.amount),
                frequency: formData.recurring ? formData.frequency : null,
                next_date: formData.recurring ? formData.next_date : null,
                end_date: formData.recurring ? formData.end_date : null,
            };
            // If editing an existing transaction, update it; otherwise, create a new one
            if (editTransaction) {
                // Update transaction
                const response = await axios.put(`${VITE_API_URL}/api/transactions/${editTransaction._id}`, 
                    formDataToSubmit, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTransactions(transactions.map(transaction => transaction._id === editTransaction._id ? response.data : transaction));
            } else {
                // Create new transaction
                const response = await axios.post(`${VITE_API_URL}/api/transactions`, 
                    formDataToSubmit, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTransactions([...transactions, response.data]);
            }
            // Reset form data
            setFormData({
                type: '',
                date: '',
                name: '',
                amount: '', 
                category_id: '',
                recurring: false,
                frequency: '',
                next_date: '',
                end_date: ''
            });
            setEditTransaction(null);
            closeModal();
        } catch (err) {
            console.error('Error submitting transaction:', err);
            setError(err);
        }
    };

    // Function to confirm deletion of a transaction
    const confirmDelete = (transaction_id) => {
        setDeleteTransaction(transaction_id)
        setShowDeleteModal(true);
    }

    // Function to handle deletion of a transaction
    const handleDelete = async () => {
        try {
            await axios.delete(`${VITE_API_URL}/api/transactions/${deleteTransaction}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTransactions(transactions.filter(transaction => transaction._id !== deleteTransaction));
        } catch (err) {
            console.error('Error deleting transaction:', err);
            setError(err);
        } finally {
        setDeleteTransaction(null);
        setShowDeleteModal(false);
        }
    };

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }
    if (error) {
        return <div className="p-4 text-red-500">Error: {error.message}</div>;
    }
    if (transactions.length === 0) {
        return <div className="p-4">No transactions found.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

            {/* Filter by type: income or expense */}
            <div className="flex items-center gap-2">
                <label htmlFor="filter" className="text-sm font-medium text-gray-700">Filter:</label>
                <select id="filter" className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>

            {/* Sort by amount or date */}
            <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
                <select id="sort" className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">None</option>
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="category">Category</option>
                </select>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
                <label htmlFor="search" className="text-sm font-medium text-gray-700">Search:</label>
                <input type="text" id="search" placeholder="Search transactions..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                onChange={(e) => handleSearch(e.target.value)}/>
            </div>

            {/* Add button */}
            <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 whitespace-nowrap">
                Add Transaction
            </button>
        </div>

        {/* Transaction list */}
        <div className="space-y-4">
        {filteredTransactions.map(transaction => {
            const matchedCategory = categories.find(
            category => String(category._id) === String(transaction.category_id._id)
            );
            // Determine the arrow direction and color based on transaction type
            const isIncome = transaction.type === 'income';
            const arrowColor = isIncome ? 'text-green-500' : 'text-red-500';
            const arrow = isIncome ? '↑' : '↓';
            // Format the date
            const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            });

        return (
            
            <div key={transaction._id} className="flex justify-between items-start p-4 bg-white rounded-2xl shadow-md">
                {/* Left arrow icon */}
                <div className="flex flex-col items-center mr-4">
                    <div className={`text-2xl font-bold ${arrowColor}`}>{arrow}</div>
                </div>
                {/* Transaction name, category and recurring option */}
                <div className="flex-1">
                    <div className="text-lg font-semibold">{transaction.name}</div>
                    <div className="text-sm text-gray-500">{matchedCategory?.name || 'Uncategorized'}</div>
                    {transaction.recurring && (
                        <div className="text-sm text-blue-500">Recurring: {transaction.frequency}</div>
                    )}
                </div>
                {/* Amount and date */}
                <div className="flex items-center gap-4 pl-4">
                <div className="text-right">
                    <div className="text-lg font-semibold">
                    {isIncome ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">{formattedDate}</div>
                </div>
                {/* Edit and delete buttons */}
                <div className="flex flex-col items-center space-y-2">
                    <button onClick={() => openModal(transaction)} className="hover:text-blue-700" title="Edit">
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => confirmDelete(transaction._id)} className="hover:text-red-700" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
                </div>
            </div>
        );
        })}
        </div>

        <Modal isOpen={showModal} onClose={closeModal} title={editTransaction ? "Edit Transaction" : "Add Transaction"}>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Type</label>
                    <select className="w-full border border-gray-300 rounded p-2"
                        value={formData.type} onChange={(e) => setFormData({...formData, type:e.target.value})}
                        required>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    {formErrors.type && (
                        <span className="text-red-500 text-xs">{formErrors.type}</span>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Date</label>
                    <input className="w-full border border-gray-300 rounded p-2" type="date" 
                        value={formData.date} onChange={(e) => setFormData({...formData, date:e.target.value})}
                        required/>
                    {formErrors.date && (
                        <span className="text-red-500 text-xs">{formErrors.date}</span>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Name</label>
                    <input className="w-full border border-gray-300 rounded p-2" type="text" 
                        value={formData.name} onChange={(e) => setFormData({...formData, name:e.target.value})}
                        required/>
                    {formErrors.name && (
                        <span className="text-red-500 text-xs">{formErrors.name}</span>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Amount</label>
                    <input className="w-full border border-gray-300 rounded p-2"
                        value={formData.amount} onChange={(e) => setFormData({...formData, amount:e.target.value})} type="number" step="0.01" 
                        required/>
                    {formErrors.amount && (
                        <span className="text-red-500 text-xs">{formErrors.amount}</span>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Category</label>
                    <select className="w-full border border-gray-300 rounded p-2"
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        required>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                    {formErrors.category_id && (
                        <span className="text-red-500 text-xs">{formErrors.category_id}</span>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Recurring</label>
                    <input type="checkbox" 
                        checked={formData.recurring} onChange={(e) => setFormData({...formData, recurring: e.target.checked})}/>
                    <span className="ml-2">Yes</span>
                </div>
                { formData.recurring && (
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Frequency</label>
                        <select className="w-full border border-gray-300 rounded p-2"
                            value={formData.frequency} onChange={(e) => setFormData({...formData, frequency:e.target.value})}>
                            <option value="">Select Frequency</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {formErrors.frequency && (
                            <span className="text-red-500 text-xs">{formErrors.frequency}</span>
                        )}
                    </div>
                )}
                { formData.recurring && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Next Date</label>
                            <input className="w-full border border-gray-300 rounded p-2" type="date"
                                value={formData.next_date} onChange={(e) => setFormData({...formData, next_date:e.target.value})}/>
                            {formErrors.next_date && (
                            <span className="text-red-500 text-xs">{formErrors.next_date}</span>
                        )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">End Date</label>
                            <input className="w-full border border-gray-300 rounded p-2" type="date"
                                value={formData.end_date} onChange={(e) => setFormData({...formData, end_date:e.target.value})}/>
                            {formErrors.end_date && (
                            <span className="text-red-500 text-xs">{formErrors.end_date}</span>
                        )}
                        </div>
                    </>
                )}
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" disabled={loading}>
                Save
                </button>
            </form>
        </Modal>

        <Modal isOpen={showDeleteModal} title="Confirm Deletion" onClose={closeDeleteModal}>
            <div className="space-y-4">
                <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
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

export default Transactions;