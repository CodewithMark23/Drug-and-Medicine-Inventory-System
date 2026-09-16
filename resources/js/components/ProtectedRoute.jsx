import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, loading, children, setAuthError }) {
    if (loading) {
        return (
            <div className="container text-center py-5 text-muted">
                Checking authentication session...
            </div>
        );
    }

    if (!user) {
        if (setAuthError) {
            setAuthError('Unauthorized access blocked. Please log in with user: pharmacist and password: med123.');
        }
        return <Navigate to="/login" replace />;
    }

    return children;
}
