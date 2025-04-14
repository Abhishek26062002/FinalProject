import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = ({ data }) => {
  // Build data for the bar chart using the fetched mcqResult data.
  const barData = {
    labels: ['Correct', 'Wrong', 'Unattempted'],
    datasets: [
      {
        label: 'MCQ Results',
        data: data ? [data.correct_count, data.incorrect_count, data.unattempted_count || 0] : [0, 0, 0],
        backgroundColor: ['green', 'red', 'blue'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bar Graph of MCQ Results',
      },
    },
  };

  return (
    <div>
      <h3>Bar Graph</h3>
      <Bar data={barData} options={options} />
    </div>
  );
};

export default BarGraph;
