import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function MedicineDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchMedicine = async () => {
            setLoading(true);
            setErrorMessage('');
            try {
                const res = await axios.get(`/api/medicines/${id}`);
                setMedicine(res.data);
            } catch (err) {
                setErrorMessage(err.response?.data?.error || `Failed to load details for medicine #${id}.`);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicine();
    }, [id]);

    const handleDelete = async () => {
        setDeleting(true);
        setErrorMessage('');
        try {
            await axios.delete(`/api/medicines/${id}`);
            navigate('/medicines', { state: { successMessage: `Medicine #${id} deleted successfully.` } });
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Failed to delete medicine record.');
            setShowDeleteConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center text-muted">
                Loading medicine details from SQLite database...
            </div>
        );
    }

    if (errorMessage && !medicine) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger py-2 small mb-3" role="alert">
                    <strong>Error: </strong> {errorMessage}
                </div>
                <Link to="/medicines" className="btn btn-secondary">
                    &larr; Back to Medicine List
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-3">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-7">
                    {/* Inline Error Banner */}
                    {errorMessage && (
                        <div className="alert alert-danger py-2 small mb-3" role="alert">
                            <strong>Error: </strong> {errorMessage}
                        </div>
                    )}

                    {/* Inline Delete Confirmation Prompt */}
                    {showDeleteConfirm && (
                        <div className="alert alert-warning py-3 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
                            <div>
                                <strong>Delete Confirmation:</strong> Are you sure you want to permanently delete <strong>{medicine.name}</strong> from the database?
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-danger btn-sm"
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="btn btn-secondary btn-sm"
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="card shadow-sm border-0">
                        <div className="card-header card-header-teal py-3 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0 fw-bold">Medicine Full Details</h5>
                                <small className="opacity-75">Database Record ID: #{medicine.id}</small>
                            </div>
                            <span className={`badge ${medicine.quantity <= 10 ? 'badge-stock-low' : 'badge-stock-good'} fs-6`}>
                                {medicine.quantity} in stock
                            </span>
                        </div>

                        <div className="card-body p-4 bg-white">
                            <table className="table table-bordered mb-4">
                                <tbody>
                                    <tr>
                                        <th className="bg-light" style={{ width: '35%', color: 'var(--primary-slate-dark)' }}>Record ID</th>
                                        <td>#{medicine.id}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light" style={{ color: 'var(--primary-slate-dark)' }}>Brand Name</th>
                                        <td className="fw-bold" style={{ color: 'var(--primary-slate-dark)' }}>{medicine.name}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light" style={{ color: 'var(--primary-slate-dark)' }}>Category</th>
                                        <td>{medicine.category || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light" style={{ color: 'var(--primary-slate-dark)' }}>Stock Quantity</th>
                                        <td>{medicine.quantity} units</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light" style={{ color: 'var(--primary-slate-dark)' }}>Unit Price</th>
                                        <td className="fw-semibold">PHP {Number(medicine.price).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light" style={{ color: 'var(--primary-slate-dark)' }}>Date Created</th>
                                        <td className="small text-muted">{new Date(medicine.created_at).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light" style={{ color: 'var(--primary-slate-dark)' }}>Last Modified</th>
                                        <td className="small text-muted">{new Date(medicine.updated_at).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Back button and Action buttons */}
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                                <Link to="/medicines" className="btn btn-outline-secondary px-3">
                                    &larr; Back to Medicine List
                                </Link>

                                <div className="d-flex gap-2">
                                    <Link to={`/medicines/${medicine.id}/edit`} className="btn btn-primary px-3">
                                        Edit Medicine
                                    </Link>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="btn btn-danger px-3"
                                        disabled={showDeleteConfirm}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
