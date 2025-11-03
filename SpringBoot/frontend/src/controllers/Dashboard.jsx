import React, { useState, useEffect } from 'react';
import { getAllReadings, downloadYieldReport } from '../services/apiService.jsx';

function Dashboard() {
    const [readings, setReadings] = useState([]);
    const [error, setError] = useState(null);

    // useEffect hook to fetch data when the component loads
    useEffect(() => {
        fetchData();
        
        // Optional: Set an interval to auto-refresh the data
        const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
        
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchData = () => {
        getAllReadings()
            .then(response => {
                setReadings(response.data);
                setError(null); // Clear any previous errors
            })
            .catch(error => {
                console.error("There was an error fetching the data:", error);
                setError("Could not fetch data. Are all 3 backend services running?");
            });
    };

    const handleDownloadReport = () => {
        downloadYieldReport()
            .then(response => {
                // Create a temporary URL for the blob data
                const url = window.URL.createObjectURL(new Blob([response.data]));
                
                // Create a temporary link element
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'yield_report.pdf'); // Set the file name
                
                // Append, click, and remove the link
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error("Error downloading report:", error);
            });
    };

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Smart Agriculture Dashboard</h1>

            <button onClick={handleDownloadReport} style={{ marginBottom: '20px' }}>
                Download PDF Report
            </button>
            
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '80%', margin: 'auto' }}>
                <thead>
                    <tr>
                        <th>ID (from CSV)</th>
                        <th>Predicted Yield (t/ha)</th>
                        <th>Soil Moisture</th>
                        <th>Temperature</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {readings.length === 0 ? (
                        <tr>
                            <td colSpan="5">No data yet. Waiting for simulator...</td>
                        </tr>
                    ) : (
                        readings.map(reading => (
                            <tr key={reading.id}>
                                <td>{reading.uniqueDataId}</td>
                                <td>{reading.predictedYield.toFixed(2)}</td>
                                <td>{reading.soilMoisture.toFixed(2)}</td>
                                <td>{reading.temperature.toFixed(2)}</td>
                                <td>{new Date(reading.timestamp).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;