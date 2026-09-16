import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Layout({ children }) {
    const { flash } = usePage().props;

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold" href="/">
                        💊 Drug & Medicine Inventory
                    </Link>
                    <div className="navbar-nav ms-auto">
                        <Link className="nav-link text-white" href="/">
                            Home
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="container py-2">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {flash.error}
                    </div>
                )}

                {/* Page Content */}
                {children}
            </main>

            <footer className="text-center py-4 text-muted small mt-5">
                &copy; {new Date().getFullYear()} Drug & Medicine Inventory System &bull; React + Inertia.js
            </footer>
        </div>
    );
}
