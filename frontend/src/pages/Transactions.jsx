import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        name: '',
        amount: '',
        category_id: ''
    });
    const [editTransaction, setEditTransaction] = useState(null);

    // const accountId = localStorage.getItem('account_id');
    // hardcoded for now
    const accountId = '682ed17f3623f7a5b0beac05';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmRjZjcxMzMxYTEwMDQzNTE4MDY5ZCIsImlhdCI6MTc0NzkwOTk5NCwiZXhwIjoxNzQ3OTk2Mzk0fQ.-V7uaXwJ2Aemcs7QXGwbL8pVjTFDfEVagV436p26ndM'
    
    const [showModal, setShowModal] = useState(false);
    const openModal = (transaction = null) => {
        if (transaction) {
            setEditTransaction(transaction);
            setFormData({
                type: transaction.type || 'expense',
                date: transaction.date.slice(0, 10),
                name: transaction.name,
                amount: transaction.amount,
                category_id: transaction.category_id
            });
        } else {
            setEditTransaction(null);
            setFormData({
                type: 'expense',
                date: '',
                name: '',
                amount: '',
                category_id: ''
            });
        };
        setShowModal(true);
    }
    const closeModal = () => setShowModal(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // const token = localStorage.getItem('token');

                const response = await axios.get(`http://localhost:5001/api/transactions`, {
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

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/categories`, {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editTransaction) {
                // Update transaction
                const response = await axios.put(`http://localhost:5001/api/transactions/${editTransaction._id}`, {
                    ...formData,
                    account_id: accountId,
                    amount: parseFloat(formData.amount),
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Submitting form data:", formData);
                setTransactions(transactions.map(transaction => transaction._id === editTransaction._id ? response.data : transaction));
            } else {
                // Create new transaction
                const response = await axios.post(`http://localhost:5001/api/transactions`, {
                    ...formData,
                    account_id: accountId,
                    amount: parseFloat(formData.amount),
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Submitting form data:", formData);
                setTransactions([...transactions, response.data]);
            }
            // Reset form data
            setFormData({
                type: '',
                date: '',
                name: '',
                amount: '', 
                category_id: ''
            });
            setEditTransaction(null);
            closeModal();
        } catch (err) {
            console.error('Error submitting transaction:', err);
            setError(err);
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
        <div className='p-6'>
            <h1 className='text-2xl font-semibold mb-4'>Transactions</h1>
            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <label htmlFor="filter" className="mr-2">Filter:</label>
                    <select id="filter" className="border border-gray-300 rounded p-2">
                        <option value="">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2">Sort by:</label>
                    <select id="sort" className="border border-gray-300 rounded p-2">
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="category">Category</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <label htmlFor="search" className="mr-2">Search:</label>        
                    <input type="text" id="search" className="border border-gray-300 rounded p-2" placeholder="Search transactions..." />
                </div>
                <button onClick={() => openModal()} className="bg-blue-500 text-white rounded p-2 ml-4">Add Transaction</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                        <tr>
                            <th className="px-4 py-2 ">Type</th>
                            <th className="px-4 py-2 ">Date</th>
                            <th className="px-4 py-2 ">Name</th>
                            <th className="px-4 py-2 ">Amount</th>
                            <th className="px-4 py-2 ">Category</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 ">{transaction.type}</td>
                                <td className="px-4 py-2 ">{new Date(transaction.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2 ">{transaction.name}</td>
                                <td className="px-4 py-2 ">{transaction.amount}</td>
                                <td className="px-4 py-2 ">{transaction.category}</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-4">
                                        <button onClick={() => openModal(transaction)} className="text-blue-500 hover:text-blue-800">
                                        <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(transaction._id)} className="text-red-500 hover:text-red-800">
                                        <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        <Modal isOpen={showModal} onClose={closeModal} title={editTransaction ? "Edit Transaction" : "Add Transaction"}>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Type</label>
                    <select className="w-full border border-gray-300 rounded p-2"
                        value={formData.type} onChange={(e) => setFormData({...formData, type:e.target.value})}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Date</label>
                    <input className="w-full border border-gray-300 rounded p-2" type="date" 
                        value={formData.date} onChange={(e) => setFormData({...formData, date:e.target.value})}/>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Name</label>
                    <input className="w-full border border-gray-300 rounded p-2" type="text" 
                        value={formData.name} onChange={(e) => setFormData({...formData, name:e.target.value})}/>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Amount</label>
                    <input className="w-full border border-gray-300 rounded p-2"
                        value={formData.amount} onChange={(e) => setFormData({...formData, amount:e.target.value})} type="number" step="0.01" />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Category</label>
                    <select className="w-full border border-gray-300 rounded p-2"
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Save
                </button>
            </form>
        </Modal>
    </div>
    );
}

export default Transactions;