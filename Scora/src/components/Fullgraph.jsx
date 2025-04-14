import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const FullGraph = ({ data }) => {
  // If data is not yet loaded, show a loading message
  if (!data) {
    return <div>Loading...</div>;
  }

  // Prepare the chart data using the fetched values
  const chartData = {
    labels: ['Correct', 'Wrong', 'Score'],
    datasets: [
      {
        label: 'MCQ Results',
        data: [data.correct_count, data.incorrect_count, data.score],
        backgroundColor: [
          'rgba(75,192,192,0.4)',
          'rgba(255,99,132,0.4)',
          'rgba(153,102,255,0.4)',
        ],
        borderColor: [
          'rgba(75,192,192,1)',
          'rgba(255,99,132,1)',
          'rgba(153,102,255,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options (optional)
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'MCQ Results Graph' },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default FullGraph;
