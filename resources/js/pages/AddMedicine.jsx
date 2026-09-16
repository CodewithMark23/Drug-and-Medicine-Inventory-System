import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AddMedicine() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerError('');

        const validationErrors = {};
        if (!formData.name.trim()) validationErrors.name = 'Medicine name is required';
        if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
            validationErrors.quantity = 'Valid non-negative quantity is required';
        }
        if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
            validationErrors.price = 'Valid non-negative price is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSaving(true);
        try {
            await axios.post('/api/medicines', formData);
            navigate('/medicines', { state: { successMessage: 'Medicine added successfully.' } });
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setServerError(err.response?.data?.error || 'Failed to save medicine.');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container py-3">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white py-3">
                            <h5 className="mb-0 fw-bold">Add New Medicine</h5>
                            <small className="text-secondary">Enter medicine details below</small>
                        </div>
                        <div className="card-body p-4">
                            {serverError && (
                                <div className="alert alert-danger py-2 small" role="alert">
                                    {serverError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Medicine Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Biogesic"
                                        autoFocus
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback small">{errors.name}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        className="form-control"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Analgesic, Antibiotic"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Quantity in Stock *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.quantity && (
                                        <div className="invalid-feedback small">{errors.quantity}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Price (PHP) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                    />
                                    {errors.price && (
                                        <div className="invalid-feedback small">{errors.price}</div>
                                    )}
                                </div>

                                <div className="d-flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4 fw-semibold"
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Medicine'}
                                    </button>
                                    <Link to="/medicines" className="btn btn-outline-secondary px-3">
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
