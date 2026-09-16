import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('pharmacist');
    const [password, setPassword] = useState('med123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/api/login', {
                username: username.trim(),
                password: password.trim(),
            });

            if (response.data.success) {
                onLoginSuccess(response.data.user);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Invalid credentials. Please enter user: pharmacist and password: med123.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header card-header-teal text-center py-3">
                            <h5 className="mb-0 fw-bold">Sign In</h5>
                            <small className="opacity-75">Drug and Medicine Inventory System</small>
                        </div>
                        <div className="card-body p-4 bg-white">
                            {error && (
                                <div className="alert alert-danger py-2 small" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter Username"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-semibold"
                                    disabled={loading}
                                >
                                    {loading ? 'Authenticating...' : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-4 pt-3 border-top text-center text-muted small">
                                Default Credentials: <strong>pharmacist</strong> / <strong>med123</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
