import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // const accountId = localStorage.getItem('account_id');
    // hardcoded for now
    const accountId = '682ed17f3623f7a5b0beac05';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmRjZjcxMzMxYTEwMDQzNTE4MDY5ZCIsImlhdCI6MTc0NzkwOTk5NCwiZXhwIjoxNzQ3OTk2Mzk0fQ.-V7uaXwJ2Aemcs7QXGwbL8pVjTFDfEVagV436p26ndM'
    
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
                console.log('Fetched transactions:', response.data);
                setTransactions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }
    , []);

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
                <button className="bg-blue-500 text-white rounded p-2 ml-4">Add Transaction</button>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Transactions;