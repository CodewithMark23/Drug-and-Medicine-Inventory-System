import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function EditMedicine() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const res = await axios.get(`/api/medicines/${id}`);
                setFormData({
                    name: res.data.name || '',
                    category: res.data.category || '',
                    quantity: res.data.quantity !== undefined ? res.data.quantity : '',
                    price: res.data.price !== undefined ? res.data.price : '',
                });
            } catch (err) {
                setServerError(err.response?.data?.error || 'Failed to load medicine data.');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicine();
    }, [id]);

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
            await axios.put(`/api/medicines/${id}`, formData);
            navigate(`/medicines/${id}`, { state: { successMessage: 'Medicine updated successfully.' } });
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setServerError(err.response?.data?.error || 'Failed to update medicine.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center text-muted">
                Loading medicine for editing...
            </div>
        );
    }

    return (
        <div className="container py-3">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white py-3">
                            <h5 className="mb-0 fw-bold">Edit Medicine</h5>
                            <small className="text-secondary">Update record #{id}</small>
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
                                        required
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
                                        min="0"
                                        required
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
                                        min="0"
                                        required
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
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <Link to={`/medicines/${id}`} className="btn btn-outline-secondary px-3">
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
