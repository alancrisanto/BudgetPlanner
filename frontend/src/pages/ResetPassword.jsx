import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (password !== confirm) {
            return setError("Passwords don't match.");
        }

        try {
            const res = await axios.post(`/api/auth/reset-password/${token}`, {
                password,
            });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="password"
                    placeholder="New password"
                    className="w-full border px-4 py-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full border px-4 py-2 rounded"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}
