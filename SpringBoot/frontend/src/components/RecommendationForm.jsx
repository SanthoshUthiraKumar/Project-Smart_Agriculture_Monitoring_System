import React, { useState } from 'react';
import axios from 'axios';

const RecommendationForm = () => {
    const [formData, setFormData] = useState({
        nitrogen: '', phosphorus: '', potassium: '', ph: '', rainfall: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Call Java Backend
            const response = await axios.post('http://localhost:8080/api/recommend/crop', formData);
            setResult(response.data);
        } catch (error) {
            console.error("Error getting recommendation:", error);
            alert("Failed to get recommendation. Ensure Java backend and .NET service are running.");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ textAlign: 'center', color: '#2c3e50' }}>🌱 AI Crop Recommendation</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input name="nitrogen" type="number" placeholder="Nitrogen (N)" onChange={handleChange} required style={{ padding: '10px', flex: 1 }} />
                    <input name="phosphorus" type="number" placeholder="Phosphorus (P)" onChange={handleChange} required style={{ padding: '10px', flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input name="potassium" type="number" placeholder="Potassium (K)" onChange={handleChange} required style={{ padding: '10px', flex: 1 }} />
                    <input name="ph" type="number" step="0.1" placeholder="pH Level" onChange={handleChange} required style={{ padding: '10px', flex: 1 }} />
                </div>
                <input name="rainfall" type="number" placeholder="Rainfall (mm)" onChange={handleChange} required style={{ padding: '10px' }} />
                
                <button type="submit" disabled={loading} style={{ 
                    backgroundColor: '#27ae60', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' 
                }}>
                    {loading ? 'Analyzing...' : 'Get Best Crop'}
                </button>
            </form>

            {result && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '5px', textAlign: 'center' }}>
                    <h4 style={{ margin: 0 }}>Recommended Crop:</h4>
                    <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{result}</span>
                </div>
            )}
        </div>
    );
};

export default RecommendationForm;