import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import AdminPage from './admin';
import ClientPage from './client';
import Register from './client/Register';
import Login from './client/Login';

export default function App() {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                {/* If no token, allow access to Register/Login */}
                {!token ? (
                    <>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </>
                ) : (
                    <>
                        {/* If token exists, route to appropriate pages */}
                        <Route path="/" element={<ClientPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}
