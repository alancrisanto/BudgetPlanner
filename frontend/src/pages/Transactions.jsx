import React, { use } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { useMemo } from 'react';


const VITE_API_URL = import.meta.env.VITE_API_URL

function Transactions() {
    // Verify if the user is authenticated
    // and retrieve user information from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;

    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');

    // State variables for transactions, loading, error, categories, form data, and modals
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        account_id: selectedAccount || '',
        type: '',
        date: '',
        name: '',
        amount: '',
        category_id: '',
        tags: [],
    });

    const [editTransaction, setEditTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const openModal = (transaction = null) => {
        if (transaction) {
            setEditTransaction(transaction);
            setFormData({
                account_id: transaction.account_id._id || selectedAccount,
                type: transaction.type || 'expense',
                date: transaction.date.slice(0, 10),
                name: transaction.name,
                amount: transaction.amount,
                category_id: transaction.category_id,
                tags: transaction.tags || [],

            });
        } else {
            setEditTransaction(null);
            setFormData({
                account_id: selectedAccount,
                type: 'expense',
                date: '',
                name: '',
                amount: '',
                category_id: '',
                tags: [],
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

    //tags state
    const [tagInput, setTagInput] = useState([]);
    const [selectedTagFilter, setSelectedTagFilter] = useState('');

    const allTags = useMemo(() => {
        const tagSet = new Set();
        transactions.forEach(tx => {
            (tx.tags || []).forEach(tag => {
                if (!tagSet.has(tag.name)) {
                    tagSet.add(tag.name)
                }
                else {
                    return
                }
            })
        })
        return Array.from(tagSet);
    }, [transactions]);



    useEffect(() => {
        let filteredResult = [...transactions];
        // Filter transactions based on selected account
        if (selectedAccount && selectedAccount !== 'all') {
            filteredResult = filteredResult.filter(transaction => String(transaction.account_id._id) === String(selectedAccount));
        }
        // Filter transactions based on selected filter
        if (selectedFilter === 'income' || selectedFilter === 'expense') {
            filteredResult = filteredResult.filter(transaction => transaction.type === selectedFilter);
        }
        if (selectedTagFilter) {
            filteredResult = filteredResult.filter(transaction =>
                (transaction.tags || []).some(tag => tag.name.trim().toLowerCase() === selectedTagFilter.toLowerCase())
            );
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
    }, [transactions, selectedAccount, selectedFilter, sortBy, selectedTagFilter]);

    // Handle search functionality
    const handleSearch = (searchTerm) => {
        // Filter transactions based on search term
        const filtered = transactions.filter(transaction =>
            transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category_id.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTransactions(filtered);
    };

    // Fetch accounts, transactions and categories
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError(new Error('User is not authenticated.'));
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const [accountsResponse, transactionsResponse, categoriesResponse] = await Promise.all([
                    axios.get(`${VITE_API_URL}/api/accounts`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get(`${VITE_API_URL}/api/transactions`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get(`${VITE_API_URL}/api/categories`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);
                console.log("Transactions fetched:", transactionsResponse.data);
                setAccounts(accountsResponse.data);
                setTransactions(transactionsResponse.data);
                setCategories(categoriesResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        // If token is available, fetch data
        if (token) {
            fetchData();
        }
    }, [token]);

    // Handle form submission for adding or editing transactions
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        // Check if all required fields are filled correctly
        if (!formData.account_id) errors.account_id = 'Account ID is required.';
        if (!formData.type) errors.type = 'Please select a transaction type.';
        if (!formData.date) errors.date = 'Please select a date.';
        if (!formData.name) errors.name = 'Please enter a name.';
        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) errors.amount = 'Please enter a valid amount.';
        if (!formData.category_id) errors.category_id = 'Please select a category.';
        if (new Date(formData.date) > new Date()) errors.date = 'Date cannot be in the future.';
        if (formData.type !== 'income' && formData.type !== 'expense') errors.type = 'Invalid transaction type.';
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({}); // Clear errors if no validation issues
        try {
            // Prepare form data for submission
            const cleanedTag = tagInput.trim();
            let updatedTags = formData.tags;

            if (cleanedTag && !formData.tags.includes(cleanedTag)) {
                updatedTags = [...formData.tags, cleanedTag];
                setFormData(prev => ({
                    ...prev,
                    tags: updatedTags
                }));
            }
            let formDataToSubmit = {
                ...formData,
                account_id: formData.account_id,
                amount: parseFloat(formData.amount),
                tags: updatedTags,
            };

            console.log('Submitting transaction:', formDataToSubmit);
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
                console.log('📤 Final data being sent:', JSON.stringify(formDataToSubmit, null, 2));
                console.log('✅ Tags at send-time:', formDataToSubmit.tags);

                const response = await axios.post(`${VITE_API_URL}/api/transactions`,
                    formDataToSubmit, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                console.log("response data", response.data)
                setTransactions([...transactions, response.data]);
            }
            // Reset form data
            setFormData({
                account_id: selectedAccount || '',
                type: '',
                date: '',
                name: '',
                amount: '',
                category_id: '',
                tags: [],
            });
            setEditTransaction(null);
            closeModal();
        } catch (err) {
            console.error('Error submitting transaction:', err);
            console.log(err)
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

    if (error) {
        return <div className="p-4 text-red-500">Error: {error.message}</div>;
    }


    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !formData.tags.includes(newTag)) {
                setFormData({ ...formData, tags: [...formData.tags, newTag] });
            }
            setTagInput('');
        }
    };

    const removeTag = (index) => {
        const updatedTags = formData.tags.filter((_, i) => i !== index);
        setFormData({ ...formData, tags: updatedTags });
    };

    return (
        <>
            <title>Transactions | Budget Planner</title>
            <meta name="description" content="View and manage all your transactions in one convenient place — categorized and searchable." />
            <meta name="keywords" content="transactions, budget records, expenses, income entries, transaction log" />
            <meta name="author" content="Veihi Joy Tupai,  Cameron Pedro, Rama Krishna Bhagi Perez, Bamutesiza Ronald" />

            <meta property="og:title" content="BudgetPlanner | Transactions" />
            <meta property="og:description" content="Browse all your financial transactions with ease." />
            <meta property="og:url" content="" />
            <meta property="og:image" content="" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="BudgetPlanner | Transactions" />
            <meta name="twitter:description" content="Search, filter, and analyze your past transactions." />
            <meta name="twitter:image" content="" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    {/* Filter by account */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="account" className="text-sm font-medium text-gray-700">Account</label>
                        <select id="account" className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                            <option value="all">All</option>
                            {accounts.map(account => (
                                <option key={account._id} value={account._id}>{account.name}</option>
                            ))}
                        </select>
                    </div>

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

                    {/**filter by tag */}
                    <div className="flex items-center gap-2 mb-4">
                        <label htmlFor="tagFilter" className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            Filter by Tag
                        </label>
                        <select
                            id="tagFilter"
                            value={selectedTagFilter}
                            onChange={(e) => setSelectedTagFilter(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">-- All Tags --</option>
                            {allTags.map((tag, idx) => (
                                <option key={idx} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    {/* Search */}
                    <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
                        <label htmlFor="search" className="text-sm font-medium text-gray-700">Search:</label>
                        <input type="text" id="search" placeholder="Search transactions..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            onChange={(e) => handleSearch(e.target.value)} />
                    </div>

                    {/* Add button */}
                    <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 whitespace-nowrap">
                        Add Transaction
                    </button>
                </div>

                {loading ? (<div className="text-center">Loading transactions...</div>
                ) : (
                    <>
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center text-gray-500 mt-12">
                                No transactions found.
                            </div>
                        ) : (
                            // Transactions list
                            <div className="space-y-4">
                                {filteredTransactions.map(transaction => {
                                    const matchedCategory = categories.find(
                                        category => String(category._id) === String(transaction.category_id._id)
                                    );
                                    console.log("this is the matched category", matchedCategory)
                                    // Determine the arrow direction and color based on transaction type
                                    const isIncome = transaction.type === 'income';
                                    const arrowColor = isIncome ? 'text-green-500' : 'text-red-500';
                                    const arrow = isIncome ? '↑' : '↓';
                                    // Format the date
                                    const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
                                        timezone: 'UTC',
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
                                                <div className="text-sm text-gray-500">{transaction.account_id?.name || "No account"}</div>
                                            </div>
                                            {/**tags display */}

                                            {/* Tags */}
                                            {transaction.tags && transaction.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {console.log("transactions to be displayed", transaction.tags)}
                                                    {transaction.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-full"
                                                        >
                                                            #{tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}


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
                        )}
                    </>
                )}

                {/* Modal for adding/editing transactions */}
                <Modal isOpen={showModal} onClose={closeModal} title={editTransaction ? "Edit Transaction" : "Add Transaction"}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4" >
                            <label className="block mb-1 font-medium">Account</label>
                            <select className="w-full border border-gray-300 rounded p-2"
                                value={formData.account_id} onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                                required>
                                <option value="">Select Account</option>
                                {accounts.map(account => (
                                    <option key={account._id} value={account._id}>{account.name}</option>
                                ))}
                            </select>
                            {formErrors.account_id && (
                                <span className="text-red-500 text-xs">{formErrors.account_id}</span>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Type</label>
                            <select className="w-full border border-gray-300 rounded p-2"
                                value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                                value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required />
                            {formErrors.date && (
                                <span className="text-red-500 text-xs">{formErrors.date}</span>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Name</label>
                            <input className="w-full border border-gray-300 rounded p-2" type="text"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required />
                            {formErrors.name && (
                                <span className="text-red-500 text-xs">{formErrors.name}</span>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Amount</label>
                            <input className="w-full border border-gray-300 rounded p-2"
                                value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} type="number" step="0.01"
                                required />
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
                        <div className="flex flex-wrap gap-2 items-center">
                            {formData.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Add tag and press Enter"
                                className="border px-2 py-1 rounded"
                            />
                        </div>

                        <button type="submit" className="mt-5 bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
                            Save
                        </button>
                    </form>
                </Modal>

                {/* Modal for confirming deletion */}
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
        </>

    );
}

export default Transactions;