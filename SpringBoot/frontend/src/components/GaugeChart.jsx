import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const GaugeChart = ({ value, label, unit, max = 100 }) => {
  const data = {
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [value, max - value],
        backgroundColor: [
          label === 'Soil Moisture' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
          'rgba(230, 230, 230, 1)',
        ],
        borderColor: [
          label === 'Soil Moisture' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
          'rgba(230, 230, 230, 1)',
        ],
        borderWidth: 1,
        circumference: 180, // Makes it a semi-circle
        rotation: 270,      // Starts it at the bottom
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: '80%',
  };

  return (
    <div style={{ width: '200px', height: '150px', textAlign: 'center', position: 'relative' }}>
      <Doughnut data={data} options={options} />
      <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px', fontWeight: 'bold' }}>
        {value.toFixed(1)}{unit}
      </div>
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
        {label}
      </div>
    </div>
  );
};

export default GaugeChart;