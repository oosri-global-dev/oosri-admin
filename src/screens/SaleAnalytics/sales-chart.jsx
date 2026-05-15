'use client';
import dynamic from 'next/dynamic';
import 'chart.js/auto';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });

const BRAND   = '#fc5353';
const BRAND_A = 'rgba(252,83,83,0.12)';
const GRID    = 'rgba(226,232,240,0.6)';

export default function SalesChart({ labels, data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#fff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        titleColor: '#111827',
        bodyColor: '#374151',
        padding: 10,
        callbacks: {
          label: (ctx) => ` $${Number(ctx.raw || 0).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        grid: { color: GRID },
        border: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: (v) => `$${Number(v).toLocaleString()}`,
        },
      },
    },
    elements: {
      point: { radius: 0, hoverRadius: 5, hoverBackgroundColor: BRAND, hoverBorderColor: '#fff', hoverBorderWidth: 2 },
      line:  { borderWidth: 2, tension: 0.4 },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Earnings',
        data,
        borderColor: BRAND,
        backgroundColor: BRAND_A,
        fill: 'start',
      },
    ],
  };

  return <Line options={options} data={chartData} />;
}
