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
    const [submitting, setSubmitting] = useState(false);
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
        setServerError('');

        const validationErrors = {};
        if (!formData.name.trim()) {
            validationErrors.name = 'Brand name is required';
        }
        if (!formData.category.trim()) {
            validationErrors.category = 'Category is required';
        }
        if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
            validationErrors.quantity = 'Stock quantity is required (0 or greater)';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/api/medicines', {
                name: formData.name.trim(),
                category: formData.category.trim(),
                quantity: Number(formData.quantity),
                price: formData.price !== '' ? Number(formData.price) : 0,
            });

            navigate('/medicines', { state: { successMessage: 'Medicine added successfully.' } });
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setServerError(err.response?.data?.error || 'Failed to add medicine.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-3">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-header card-header-pink py-3">
                            <h5 className="mb-0 fw-bold">Add Medicine</h5>
                            <small className="opacity-75">Fill in the required fields</small>
                        </div>
                        <div className="card-body p-4 bg-white">
                            {serverError && (
                                <div className="alert alert-danger py-2 small" role="alert">
                                    {serverError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Brand Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter brand name (e.g. Biogesic)"
                                        autoFocus
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback small">{errors.name}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Category *</label>
                                    <input
                                        type="text"
                                        name="category"
                                        className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="Enter category (e.g. Analgesic)"
                                    />
                                    {errors.category && (
                                        <div className="invalid-feedback small">{errors.category}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Stock Quantity *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="Enter quantity (e.g. 100)"
                                        min="0"
                                    />
                                    {errors.quantity && (
                                        <div className="invalid-feedback small">{errors.quantity}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Price (PHP)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        className="form-control"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00 (optional)"
                                        min="0"
                                    />
                                </div>

                                <div className="d-flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4 fw-semibold"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Saving...' : 'Submit'}
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
