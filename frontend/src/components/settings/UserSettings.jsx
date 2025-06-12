import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePreferences } from '../../context/PreferencesContext';
import { User as UserIcon } from 'lucide-react';

export default function UserSettings() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const { fetchPreferences } = usePreferences();

    const [editProfile, setEditProfile] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [view, setView] = useState(null);
    const [message, setMessage] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/user/profile', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setEmail(res.data.email);
                setUsername(res.data.username);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setCurrencySymbol(res.data.preferences?.currencySymbol || '$');
            } catch {
                setMessage('Failed to load profile');
            }
        };
        fetchProfile();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/user/update-profile',
                { username, firstName, lastName, preferences: { currencySymbol } },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setMessage(res.data.message);
            setEditProfile(false);
            await fetchPreferences(); // refresh the context

        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to update profile');
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/user/update-email',
                { email: newEmail },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setMessage(res.data.message);
            setEmail(newEmail);
            setNewEmail('');
            setView(null);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to update email');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/user/change-password',
                { password, confirmPassword },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setMessage(res.data.message);
            setPassword('');
            setConfirmPassword('');
            setView(null);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to update password');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('/api/user/delete', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            localStorage.removeItem('user');
            window.location.href = '/';
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to delete account');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">

            {message && (
                <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded mb-4">
                    {message}
                </div>
            )}

            <div className="bg-white shadow rounded p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-purple-700 flex items-center gap-2">
                        <UserIcon size={18} /> Profile Overview
                    </h3>
                    {!editProfile && (
                        <button
                            onClick={() => setEditProfile(true)}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {editProfile ? (
                    <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                                required
                            />
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                                required
                            />
                        </div>

                        {/* Currency Symbol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                            <input
                                type="text"
                                value={currencySymbol}
                                onChange={(e) => setCurrencySymbol(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="col-span-2 flex space-x-3 mt-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditProfile(false)}
                                className="text-gray-600 text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Username</p>
                            <p className="font-semibold">{username}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">First Name</p>
                            <p className="font-semibold">{firstName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Last Name</p>
                            <p className="font-semibold">{lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Currency Symbol</p>
                            <p className="font-semibold">{currencySymbol}</p>
                        </div>
                    </div>
                )}
            </div>


            {/* Email */}
            <div className="bg-white  shadow p-4 rounded mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">Email</h3>
                    <button onClick={() => setView('email')} className="text-sm text-blue-600 hover:underline">Change Email</button>
                </div>
                <p className="text-gray-700">{email}</p>
                {view === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="mt-3 space-y-3">
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email" className="w-full border px-3 py-2 rounded" required />
                        <div className="flex space-x-2">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Email</button>
                            <button type="button" onClick={() => setView(null)} className="text-gray-600 text-sm">Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Password */}
            <div className="bg-white shadow p-4 rounded mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">Password</h3>
                    <button onClick={() => setView('password')} className="text-sm text-blue-600 hover:underline">Change Password</button>
                </div>
                {view === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-3">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full border px-3 py-2 rounded" required />
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full border px-3 py-2 rounded" required />
                        <div className="flex space-x-2">
                            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">Update Password</button>
                            <button type="button" onClick={() => setView(null)} className="text-gray-600 text-sm">Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Delete Account */}
            <div className="bg-white  shadow p-4 rounded border-t mt-6">
                <h3 className="font-semibold text-lg text-red-600 mb-2">Delete Account</h3>
                <p className="text-sm text-gray-700 mb-4">Warning: This action is permanent and will delete all your data.</p>
                <button onClick={() => setConfirmOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded">Delete My Account</button>
            </div>
            {confirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                        <h2 className="text-lg font-semibold text-red-600 mb-2">Confirm Deletion</h2>
                        <p className="text-sm text-gray-700 mb-4">
                            Are you sure you want to permanently delete your account and all associated data? This cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-600 text-white rounded text-sm"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
}
