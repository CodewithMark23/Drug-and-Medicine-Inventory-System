import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-custom mb-4 shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/medicines">
                    Drug and Medicine Inventory System
                </Link>

                {user && (
                    <div className="navbar-nav d-flex flex-row align-items-center gap-3">
                        <Link className="nav-link" to="/medicines">
                            Medicine List
                        </Link>
                        <Link className="nav-link" to="/medicines/create">
                            Add Medicine
                        </Link>
                    </div>
                )}

                <div className="navbar-nav ms-auto d-flex align-items-center flex-row">
                    {user && (
                        <>
                            <span className="me-3 small" style={{ color: 'var(--color-secondary-slate-dark)' }}>
                                User: <strong>{user.name}</strong>
                            </span>
                            <button
                                onClick={onLogout}
                                className="btn btn-logout btn-sm"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
