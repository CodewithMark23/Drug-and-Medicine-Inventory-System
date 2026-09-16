import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Inventory() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [formErrors, setFormErrors] = useState({});

    // Modal / Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
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

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            quantity: '',
            price: '',
        });
        setEditingId(null);
        setFormErrors({});
        setShowForm(false);
    };

    const handleOpenAdd = () => {
        resetForm();
        setShowForm(true);
    };

    const handleOpenEdit = (item) => {
        setFormData({
            name: item.name || '',
            category: item.category || '',
            quantity: item.quantity !== undefined ? item.quantity : '',
            price: item.price !== undefined ? item.price : '',
        });
        setEditingId(item.id);
        setFormErrors({});
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        const errors = {};
        if (!formData.name.trim()) errors.name = 'Medicine name is required';
        if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
            errors.quantity = 'Valid non-negative quantity is required';
        }
        if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
            errors.price = 'Valid non-negative price is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editingId) {
                await axios.put(`/api/medicines/${editingId}`, formData);
                setMessage({ text: 'Medicine updated successfully in database.', type: 'success' });
            } else {
                await axios.post('/api/medicines', formData);
                setMessage({ text: 'Medicine added successfully to database.', type: 'success' });
            }
            resetForm();
            fetchMedicines();
        } catch (err) {
            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
            } else {
                setMessage({
                    text: err.response?.data?.error || 'An error occurred while saving.',
                    type: 'danger',
                });
            }
        }
    };

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
        <div className="container py-2">
            {/* System Notification Banner */}
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

            {/* Header & Controls */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <div>
                    <h3 className="fw-bold mb-0">Medicine Inventory</h3>
                    <small className="text-muted">Database Records: {medicines.length} items</small>
                </div>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search medicines..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: '260px' }}
                    />
                    <button
                        className="btn btn-primary text-nowrap"
                        onClick={handleOpenAdd}
                    >
                        + Add Medicine
                    </button>
                </div>
            </div>

            {/* Add / Edit Form Card */}
            {showForm && (
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-secondary text-white py-2">
                        <h6 className="mb-0 fw-semibold">
                            {editingId ? 'Edit Medicine Record' : 'Add New Medicine Record'}
                        </h6>
                    </div>
                    <div className="card-body p-3">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Medicine Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Paracetamol"
                                    />
                                    {formErrors.name && (
                                        <div className="invalid-feedback small">{formErrors.name}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        className="form-control"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Analgesic, Antibiotic"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Quantity in Stock *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className={`form-control ${formErrors.quantity ? 'is-invalid' : ''}`}
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {formErrors.quantity && (
                                        <div className="invalid-feedback small">{formErrors.quantity}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Price (PHP) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        min="0"
                                    />
                                    {formErrors.price && (
                                        <div className="invalid-feedback small">{formErrors.price}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                <button type="submit" className="btn btn-success px-4">
                                    {editingId ? 'Save Changes' : 'Add to Database'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-3"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Data Table */}
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
                                            Loading inventory data from database...
                                        </td>
                                    </tr>
                                ) : filteredMedicines.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No medicine records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMedicines.map((item) => (
                                        <tr key={item.id}>
                                            <td className="text-muted small">{item.id}</td>
                                            <td className="fw-semibold">{item.name}</td>
                                            <td>{item.category || '-'}</td>
                                            <td>
                                                <span className={`badge ${item.quantity <= 10 ? 'bg-danger' : 'bg-success'}`}>
                                                    {item.quantity} in stock
                                                </span>
                                            </td>
                                            <td>PHP {Number(item.price).toFixed(2)}</td>
                                            <td className="text-end">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="btn btn-sm btn-outline-primary me-1"
                                                >
                                                    Edit
                                                </button>
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
