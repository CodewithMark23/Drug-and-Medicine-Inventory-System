import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import MedicineList from './pages/MedicineList';
import AddMedicine from './pages/AddMedicine';
import MedicineDetails from './pages/MedicineDetails';
import EditMedicine from './pages/EditMedicine';

axios.defaults.withCredentials = true;

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (e) {
            // continue logout on client
        }
        setUser(null);
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
                                    <Navigate to="/medicines" replace />
                                ) : (
                                    <Login onLoginSuccess={handleLoginSuccess} />
                                )
                            }
                        />

                        {/* Redirect / to /medicines */}
                        <Route
                            path="/"
                            element={<Navigate to="/medicines" replace />}
                        />

                        {/* Route 1: Medicine List */}
                        <Route
                            path="/medicines"
                            element={
                                <ProtectedRoute user={user} loading={loading}>
                                    <MedicineList />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route 2: Add Medicine (Direct navigation) */}
                        <Route
                            path="/medicines/create"
                            element={
                                <ProtectedRoute user={user} loading={loading}>
                                    <AddMedicine />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route 3: Medicine Details / Review */}
                        <Route
                            path="/medicines/:id"
                            element={
                                <ProtectedRoute user={user} loading={loading}>
                                    <MedicineDetails />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route 4: Edit Medicine */}
                        <Route
                            path="/medicines/:id/edit"
                            element={
                                <ProtectedRoute user={user} loading={loading}>
                                    <EditMedicine />
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch all fallback */}
                        <Route path="*" element={<Navigate to="/medicines" replace />} />
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
