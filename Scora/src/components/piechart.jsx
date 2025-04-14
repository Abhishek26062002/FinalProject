import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const pieData = {
    labels: ['Correct', 'Wrong'],
    datasets: [
      {
        label: 'MCQ Results',
        data: data ? [data.correct_count, data.incorrect_count] : [0, 0],
        backgroundColor: ['green', 'red'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Pie Chart of MCQ Results',
      },
    },
  };

  return (
    <div>
      <h3>Pie Chart</h3>
      <Pie data={pieData} options={options} />
    </div>
  );
};

export default PieChart;
