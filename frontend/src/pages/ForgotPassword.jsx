import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        try {
            const res = await axios.post('/api/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>

                {message && (
                    <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm shadow-sm">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm shadow-sm">
                        {error}
                    </p>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                    >
                        Send Reset Link
                    </button>
                </form>

                <p className="text-sm text-gray-600">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link>
                </p>
            </div>
        </div>
    );
}
