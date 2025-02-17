import React, { useState } from 'react';
import axios from 'axios';
import ShopMeai from '../assets/spmeai.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);  // Show loading indicator
        setMessage('');

        try {
            const response = await axios.post("https://shopmeai-bc.onrender.com/login", {
                email,
                password,
            });

            // If login is successful, store token and redirect to homepage
            const token = response.data.token;
            localStorage.setItem('token', token);  // Save token in localStorage for later use
            localStorage.setItem('username', response.data.user);  // Save username in localStorage
            setMessage('Login successful!');
            setMessageType('success');
            setTimeout(() => {
                window.location.href = '/';  // Redirect to homepage
            }, 1000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            setMessage(errorMessage);
            setMessageType('error');
        } finally {
            setLoading(false);  // Hide loading indicator
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center">
            <img src={ShopMeai} alt="ShopMeai" className="w-1/4 rounded-full object-cover" />
            <div className="card border p-10 rounded-xl w-md">
                <h1 className='text-center text-sm'>Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label htmlFor="username">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        className='border p-4 rounded-lg bg-gray-500'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        className='border p-4 rounded-lg bg-gray-500'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className={`bg-green-500 text-white px-4 py-2 rounded-lg ${loading ? 'cursor-wait' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Show message */}
                    {message && (
                        <p className={`text-center ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
                    )}

                    <p className='text-center'>Don't have an account? <a href="/register" className='text-blue-500'>Register</a></p>
                </form>
            </div>
        </div>
    );
}
