import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import { Ellipsis } from 'lucide-react';

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

        <>
            <title>Accounts | Budget Planner</title>
            <meta name="description" content="Manage your bank accounts and financial sources connected to BudgetPlanner." />
            <meta name="keywords" content="bank accounts, finance sources, linked accounts, budget setup" />
            <meta name="author" content="Veihi Joy Tupai,  Cameron Pedro, _Rama Krishna Bhagi Perez, Bamutesiza Ronald" />

            <meta property="og:title" content="BudgetPlanner | Accounts" />
            <meta property="og:description" content="Easily manage your accounts in BudgetPlanner." />
            <meta property="og:url" content="" />
            <meta property="og:image" content="" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="BudgetPlanner | Accounts" />
            <meta name="twitter:description" content="Track and manage all your financial accounts here." />
            <meta name="twitter:image" content="" />
            
        <div className="flex flex-col min-h-screen p-6">
            <h1 className="text-2xl font-semibold mb-4">Accounts</h1>

            <div className="w-full max-w-6xl flex mb-10">

                <div className="flex-shrink-0">
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 whitespace-nowrap"
                    >
                        Add New Account
                    </button>
                </div>
            </div>

                <div className="w-flow max-w-6xl">
                    {accounts.length === 0 ? (
                        <p className="text-gray-500 text-center">No accounts yet.</p>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                            {accounts.map(account => (
                                <div key={account._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
                                        <Link to={`/accounts/${account._id}`} className='text-gray-500 hover:text-gray-700'><Ellipsis size={18} /></Link>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>Income: <span className="text-green-600 font-medium">${(account.income_total).toFixed(2) || 0}</span></p>
                                        <p>Expenses: <span className="text-red-600 font-medium">${(account.expense_total).toFixed(2) || 0}</span></p>
                                        <p className="font-semibold text-gray-700">Remainder: ${Number((account.income_total || 0) - (account.expense_total || 0)).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
        </>
        
    );
}

export default Accounts;