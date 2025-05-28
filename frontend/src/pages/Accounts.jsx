import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';

const VITE_API_URL = import.meta.env.VITE_API_URL;

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: ''
    });
    const [showModal, setShowModal] = useState(false);
    const openModal = (account = null) => {
        if (account) {
            setFormData({
                name: account.name
            });
        } else {
            setFormData({
                name: ''
            });
        }
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
        setFormErrors({});
    }

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated) {
        navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch accounts on load if authenticated
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchAccounts = async () => {
            if (!token) return;

            try {
                const res = await axios.get(`${VITE_API_URL}/api/accounts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Fetched accounts:', res.data);
                setAccounts(res.data);
            } catch (err) {
                console.error('Failed to fetch accounts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, [isAuthenticated]);

    const handleAddAccount = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.name) {
            errors.name = 'Name is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const { name } = formData;

        if (!token) {
            console.error('No authentication token found');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(`${VITE_API_URL}/api/accounts`, { name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Account created:', res.data);
            setAccounts(prevAccounts => [...prevAccounts, res.data]);

            // Reset form and close modal
            setFormData({ name: '' });
            setFormErrors({});
            setShowModal(false);
        } catch (err) {
            console.error('Failed to create account:', err);
            setError(err.response ? err.response.data : 'Failed to create account');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }
    if (error) {
        return <div className="p-4 text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Accounts</h2>

            <div className="w-full max-w-6xl flex space-x-6">

                <div className="flex-shrink-0">
                <button
                    onClick={() => openModal()}
                    className="py-2 px-6 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    Add New Account
                </button>
                </div>

                <div className="flex-grow">
                {accounts.length === 0 ? (
                    <p className="text-gray-500 text-center">No accounts yet.</p>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                    {accounts.map(account => (
                        <div key={account._id} className="p-4 border rounded shadow-sm relative">
                        <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
                        <p className="text-sm text-gray-600">Income: ${account.income_total || 0}</p>
                        <p className="text-sm text-gray-600">Expenses: ${account.expense_total || 0}</p>
                        <p className="text-sm font-bold text-green-700">Remainder: ${account.remainder || 0}</p>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
            
            <Modal isOpen={showModal} onClose={closeModal} title="Add Account" onSubmit={handleAddAccount}>
                <form onSubmit={handleAddAccount} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Account Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`mt-1 block w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Create Account
                    </button>
                </form>
            </Modal>

        </div>
    );
}

export default Accounts;