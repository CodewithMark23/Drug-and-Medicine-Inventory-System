import React from 'react';
import Layout from '../Layouts/Layout';
import { Head } from '@inertiajs/react';

export default function Welcome({ status = 'Ready', db = 'sqlite' }) {
    return (
        <Layout>
            <Head title="Welcome" />
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="p-5 mb-4 bg-white rounded-3 card shadow-sm text-center">
                        <h1 className="display-6 fw-bold text-primary mb-3">
                            💊 Drug & Medicine Inventory System
                        </h1>
                        <p className="lead text-secondary">
                            Laravel + Inertia.js + React is ready for your 2-hour lab exam.
                        </p>
                        <hr className="my-4" />

                        <div className="row text-start g-3">
                            <div className="col-md-4">
                                <div className="card h-100 p-3 bg-light border-0">
                                    <h5 className="fw-bold text-dark">⚛️ React + Inertia</h5>
                                    <p className="small text-muted mb-2">In your Controller:</p>
                                    <code>return Inertia::render('Medicines/Index', [...]);</code>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card h-100 p-3 bg-light border-0">
                                    <h5 className="fw-bold text-dark">📦 Create Model + CRUD</h5>
                                    <p className="small text-muted mb-2">Generate Model, Migration & Controller:</p>
                                    <code>php artisan make:model Medicine -mcr</code>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card h-100 p-3 bg-light border-0">
                                    <h5 className="fw-bold text-dark">🚀 Run Vite & Server</h5>
                                    <p className="small text-muted mb-2">In separate terminals:</p>
                                    <code>php artisan serve</code>
                                    <div className="mt-1"><code>npm run dev</code></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <span className="badge bg-success py-2 px-3 me-2">React 19 Ready</span>
                            <span className="badge bg-primary py-2 px-3 me-2">Inertia.js Active</span>
                            <span className="badge bg-secondary py-2 px-3">DB: {db}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
