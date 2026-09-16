import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function MedicineDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const res = await axios.get(`/api/medicines/${id}`);
                setMedicine(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load medicine details.');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicine();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${medicine.name}?`)) {
            return;
        }

        try {
            await axios.delete(`/api/medicines/${id}`);
            navigate('/medicines', { state: { successMessage: 'Medicine deleted successfully.' } });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete medicine.');
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center text-muted">
                Loading medicine details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
                <Link to="/medicines" className="btn btn-secondary">
                    Back to Medicine List
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-3">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0 fw-bold">Medicine Details</h5>
                                <small className="text-secondary">Record ID: {medicine.id}</small>
                            </div>
                            <span className={`badge ${medicine.quantity <= 10 ? 'bg-danger' : 'bg-success'}`}>
                                {medicine.quantity} in stock
                            </span>
                        </div>
                        <div className="card-body p-4">
                            <table className="table table-bordered mb-4">
                                <tbody>
                                    <tr>
                                        <th className="bg-light" style={{ width: '35%' }}>Medicine Name</th>
                                        <td className="fw-semibold">{medicine.name}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">Category</th>
                                        <td>{medicine.category || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">Stock Quantity</th>
                                        <td>{medicine.quantity} units</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">Unit Price</th>
                                        <td>PHP {Number(medicine.price).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">Created At</th>
                                        <td className="small text-muted">{new Date(medicine.created_at).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">Last Updated</th>
                                        <td className="small text-muted">{new Date(medicine.updated_at).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="d-flex justify-content-between">
                                <Link to="/medicines" className="btn btn-outline-secondary">
                                    Back to List
                                </Link>
                                <div className="d-flex gap-2">
                                    <Link to={`/medicines/${medicine.id}/edit`} className="btn btn-primary">
                                        Edit Medicine
                                    </Link>
                                    <button onClick={handleDelete} className="btn btn-danger">
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
