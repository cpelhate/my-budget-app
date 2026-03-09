import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function ChartContainer({ type, data, title, options = {} }) {
  const getChartData = () => {
    switch (type) {
      case 'expensesByCategory':
        const expensesByCat = {};
        data.expenses.forEach(exp => {
          const cat = exp.category || 'Autres';
          expensesByCat[cat] = (expensesByCat[cat] || 0) + parseFloat(exp.amount || 0);
        });

        return {
          labels: Object.keys(expensesByCat),
          datasets: [{
            label: 'Dépenses',
            data: Object.values(expensesByCat),
            backgroundColor: [
              '#667eea', '#764ba2', '#27ae60', '#e67e22', '#e74c3c', '#f39c12', '#3498db'
            ],
            borderWidth: 0,
          }]
        };

      case 'monthlyBalance':
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
        const monthData = months.map((_, i) => Math.random() * 2000 - 1000);

        return {
          labels: months,
          datasets: [{
            label: 'Solde (€)',
            data: monthData,
            backgroundColor: monthData.map(val => val >= 0 ? '#27ae60' : '#e74c3c'),
            borderWidth: 1,
            borderColor: '#333',
          }]
        };

      default:
        return null;
    }
  };

  const getOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === 'monthlyBalance' ? true : false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: type === 'monthlyBalance' ? {
      y: {
        beginAtZero: false,
      }
    } : {}
  });

  const chartData = getChartData();

  if (!chartData) return null;

  return (
    <div className="chart-container">
      {type === 'expensesByCategory' && (
        <Doughnut data={chartData} options={getOptions()} />
      )}
      {type === 'monthlyBalance' && (
        <Bar data={chartData} options={getOptions()} />
      )}
    </div>
  );
}

export default ChartContainer;
