import React, { useState } from 'react';
import axios from 'axios';
import ShopMeai from '../assets/spmeai.png';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation for password match
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setMessageType('error');
            return;
        }

        setLoading(true);  // Show loading indicator
        setMessage('');
        
        try {
            const response = await axios.post("https://shopmeai-bc.onrender.com/register", {
                username,
                email,
                password,
            });

            // Show success message and store token if needed
            setMessage('User registered successfully!');
            setMessageType('success');
            const token = response.data.token;
            console.log(token);
            localStorage.setItem('token', token);
        } catch (error) {
            // Check for specific error messages from backend response
            const errorMessage = error.response?.data?.message || 'Registration failed. Try again.';
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
                <h1 className='text-center text-sm'>Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        className='border p-4 rounded-lg bg-gray-500'
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        className='border p-4 rounded-lg bg-gray-500'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete='email'
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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        className='border p-4 rounded-lg bg-gray-500'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className={`bg-green-500 text-white px-4 py-2 rounded-lg ${loading ? 'cursor-wait' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    {/* Show message */}
                    {message && (
                        <p className={`text-center ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
                    )}

                    <p className='text-center'>Already have an account? <a href="/login" className='text-blue-500'>Login</a></p>
                </form>
            </div>
        </div>
    );
}
