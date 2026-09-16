import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, loading, children }) {
    if (loading) {
        return (
            <div className="container text-center py-5 text-muted">
                Checking authentication session...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
