import React, { useState } from 'react';
import axios from 'axios';

const DiseaseUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);
        
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            // Call Java Backend
            const response = await axios.post('http://localhost:8080/api/disease/detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error:", error);
            alert("Analysis failed. Check backend services.");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px', backgroundColor: '#fff3e0' }}>
            <h3 style={{ textAlign: 'center', color: '#e67e22' }}>🍃 Plant Disease Detection</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
                
                {preview && (
                    <img src={preview} alt="Preview" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #ddd' }} />
                )}

                <button onClick={handleUpload} disabled={loading || !selectedFile} style={{
                    backgroundColor: '#e67e22', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'
                }}>
                    {loading ? 'Scanning...' : 'Analyze Leaf'}
                </button>
            </div>

            {result && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '5px', border: '1px solid #ccc' }}>
                    <p><strong>Disease:</strong> <span style={{ color: result.disease === 'Healthy' ? 'green' : 'red' }}>{result.disease}</span></p>
                    <p><strong>Confidence:</strong> {result.confidence}</p>
                    <p><strong>Advice:</strong> {result.advice}</p>
                </div>
            )}
        </div>
    );
};

export default DiseaseUpload;