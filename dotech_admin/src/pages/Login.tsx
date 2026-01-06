import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Mock Login for now (Since backend admin auth might not be fully ready/seeded)
        if (email === 'admin@dotech.com' && password === 'admin123') {
            login('mock-admin-token');
            navigate('/');
        } else {
            setError('Invalid credentials');
        }

        // Real implementation:
        // try {
        //   const { data } = await api.post('/auth/login', { email, password });
        //   login(data.accessToken);
        //   navigate('/');
        // } catch (err) {
        //   setError('Login failed');
        // }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
            {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded" style={{ color: 'var(--danger)', backgroundColor: '#fee2e2' }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{ border: '1px solid var(--border)' }}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{ border: '1px solid var(--border)' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none"
                    style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;
