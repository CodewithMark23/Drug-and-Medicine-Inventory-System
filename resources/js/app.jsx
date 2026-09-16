import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Inventory from './pages/Inventory';

// Ensure Axios sends cookies / session with requests
axios.defaults.withCredentials = true;

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await axios.get('/api/user');
                if (res.data.authenticated) {
                    setUser(res.data.user);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const handleLoginSuccess = (loggedInUser) => {
        setUser(loggedInUser);
        setAuthError('');
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (e) {
            // continue logout on client
        }
        setUser(null);
        setAuthError('');
    };

    return (
        <BrowserRouter>
            <div className="min-vh-100 d-flex flex-column bg-light">
                <Navbar user={user} onLogout={handleLogout} />

                <div className="flex-grow-1">
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                user ? (
                                    <Navigate to="/" replace />
                                ) : (
                                    <Login
                                        onLoginSuccess={handleLoginSuccess}
                                        authError={authError}
                                    />
                                )
                            }
                        />

                        <Route
                            path="/"
                            element={
                                <ProtectedRoute
                                    user={user}
                                    loading={loading}
                                    setAuthError={setAuthError}
                                >
                                    <Inventory />
                                </ProtectedRoute>
                            }
                        />

                        {/* Any other route blocked and redirected */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>

                <footer className="text-center py-3 text-muted small border-top bg-white mt-auto">
                    Drug and Medicine Inventory System &bull; Database Backed &bull; Pharmacist Access Only
                </footer>
            </div>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(<App />);
}
