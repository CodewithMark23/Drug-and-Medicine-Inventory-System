import React from 'react';

export default function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
            <div className="container">
                <span className="navbar-brand fw-bold">
                    MEDICOLEGAL Pharmacy & Store
                </span>
                <div className="navbar-nav ms-auto d-flex align-items-center flex-row">
                    {user && (
                        <>
                            <span className="text-light me-3 small">
                                User: <strong>{user.name}</strong>
                            </span>
                            <button
                                onClick={onLogout}
                                className="btn btn-outline-light btn-sm"
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
