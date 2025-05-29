import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserSettings() {
    const [email, setEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [view, setView] = useState(null);
    const [message, setMessage] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const res = await axios.get('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setEmail(res.data.email);
            } catch {
                setEmail('Not available');
            }
        };
        fetchEmail();
    }, []);

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

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">User Settings</h2>

            {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center justify-between border px-4 py-2 rounded mb-4">
                <span>{email}</span>
                <button onClick={() => setView('email')} className="text-blue-600 text-sm">Change</button>
            </div>

            <button
                onClick={() => setView('password')}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
                Change Password
            </button>

            {view === 'email' && (
                <form onSubmit={handleEmailSubmit} className="mt-4 space-y-4">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="New email"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Update Email
                    </button>
                </form>
            )}

            {view === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
                        Update Password
                    </button>
                </form>
            )}
        </div>
    );
}
