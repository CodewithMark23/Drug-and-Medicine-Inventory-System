import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function MedicineList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const detailsParam = searchParams.get('details');

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    useEffect(() => {
        if (detailsParam) {
            navigate(`/medicines/${detailsParam}`, { replace: true });
        }
    }, [detailsParam, navigate]);

    const fetchMedicines = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const res = await axios.get('/api/medicines');
            setMedicines(res.data);
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Failed to fetch medicines from SQLite database. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleDelete = async (id) => {
        setErrorMessage('');
        try {
            await axios.delete(`/api/medicines/${id}`);
            setDeleteConfirmId(null);
            setSuccessMessage('Medicine record deleted successfully from database.');
            fetchMedicines();
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Failed to delete medicine record.');
        }
    };

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.category && m.category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="container py-3">
            {/* Inline Success Banner */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show py-2 small" role="alert">
                    {successMessage}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccessMessage('')}
                    ></button>
                </div>
            )}

            {/* Inline Error Banner */}
            {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show py-2 small d-flex justify-content-between align-items-center" role="alert">
                    <div>
                        <strong>Error: </strong> {errorMessage}
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={fetchMedicines}
                        >
                            Retry
                        </button>
                        <button
                            type="button"
                            className="btn-close position-static"
                            onClick={() => setErrorMessage('')}
                        ></button>
                    </div>
                </div>
            )}

            {/* Header Controls */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <div>
                    <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-slate-dark)' }}>
                        Medicine Inventory List
                    </h3>
                    <small className="text-muted">
                        Total items in SQLite database: {medicines.length} &bull; Tap any row to view full details
                    </small>
                </div>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search medicines..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: '240px' }}
                    />
                    <Link to="/medicines/create" className="btn btn-primary text-nowrap">
                        + Add Medicine
                    </Link>
                </div>
            </div>

            {/* Main Table */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0 align-middle">
                            <thead className="table-custom-head">
                                <tr>
                                    <th style={{ width: '8%' }}>ID</th>
                                    <th>Brand Name</th>
                                    <th>Category</th>
                                    <th>Stock Quantity</th>
                                    <th>Price (PHP)</th>
                                    <th className="text-end" style={{ minWidth: '220px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Loading medicines from SQLite database...
                                        </td>
                                    </tr>
                                ) : filteredMedicines.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No medicine records found. Use "+ Add Medicine" to add records.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMedicines.map((item) => (
                                        <tr
                                            key={item.id}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/medicines/${item.id}`)}
                                            title="Click to view full details"
                                        >
                                            <td className="text-muted small fw-bold">#{item.id}</td>
                                            <td className="fw-semibold" style={{ color: 'var(--primary-slate-dark)' }}>
                                                {item.name}
                                            </td>
                                            <td>{item.category || '-'}</td>
                                            <td>
                                                <span className={`badge ${item.quantity <= 10 ? 'badge-stock-low' : 'badge-stock-good'}`}>
                                                    {item.quantity} in stock
                                                </span>
                                            </td>
                                            <td className="fw-semibold">PHP {Number(item.price).toFixed(2)}</td>
                                            <td
                                                className="text-end"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {deleteConfirmId === item.id ? (
                                                    <span className="d-inline-flex align-items-center gap-1">
                                                        <span className="text-danger small me-1">Confirm delete?</span>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="btn btn-sm btn-danger py-0 px-2"
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirmId(null)}
                                                            className="btn btn-sm btn-secondary py-0 px-2"
                                                        >
                                                            No
                                                        </button>
                                                    </span>
                                                ) : (
                                                    <>
                                                        <Link
                                                            to={`/medicines/${item.id}`}
                                                            className="btn btn-sm btn-outline-secondary me-1"
                                                        >
                                                            Details
                                                        </Link>
                                                        <Link
                                                            to={`/medicines/${item.id}/edit`}
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => setDeleteConfirmId(item.id)}
                                                            className="btn btn-sm btn-outline-danger"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
