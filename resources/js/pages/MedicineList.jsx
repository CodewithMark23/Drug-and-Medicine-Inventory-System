import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function MedicineList() {
    const location = useLocation();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState({
        text: location.state?.successMessage || '',
        type: location.state?.successMessage ? 'success' : '',
    });

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/medicines');
            setMedicines(res.data);
        } catch (err) {
            setMessage({
                text: err.response?.data?.error || 'Failed to load medicines from database.',
                type: 'danger',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
            return;
        }

        try {
            await axios.delete(`/api/medicines/${id}`);
            setMessage({ text: `${name} deleted from database.`, type: 'success' });
            fetchMedicines();
        } catch (err) {
            setMessage({
                text: err.response?.data?.error || 'Failed to delete medicine.',
                type: 'danger',
            });
        }
    };

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.category && m.category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="container py-3">
            {/* Notification Banner */}
            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage({ text: '', type: '' })}
                    ></button>
                </div>
            )}

            {/* Header & Direct Navigation to Add */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <div>
                    <h3 className="fw-bold mb-0">Medicine List</h3>
                    <small className="text-muted">Total Records: {medicines.length} medicines</small>
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
                    <Link to="/medicines/create" className="btn btn-primary text-nowrap fw-semibold">
                        + Add Medicine
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0 align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Medicine Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Loading medicines from database...
                                        </td>
                                    </tr>
                                ) : filteredMedicines.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No medicines found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMedicines.map((item) => (
                                        <tr key={item.id}>
                                            <td className="text-muted small">{item.id}</td>
                                            <td className="fw-semibold">
                                                <Link to={`/medicines/${item.id}`} className="text-decoration-none text-dark">
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td>{item.category || '-'}</td>
                                            <td>
                                                <span className={`badge ${item.quantity <= 10 ? 'bg-danger' : 'bg-success'}`}>
                                                    {item.quantity} in stock
                                                </span>
                                            </td>
                                            <td>PHP {Number(item.price).toFixed(2)}</td>
                                            <td className="text-end">
                                                <Link
                                                    to={`/medicines/${item.id}`}
                                                    className="btn btn-sm btn-outline-secondary me-1"
                                                >
                                                    View Details
                                                </Link>
                                                <Link
                                                    to={`/medicines/${item.id}/edit`}
                                                    className="btn btn-sm btn-outline-primary me-1"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    Delete
                                                </button>
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
