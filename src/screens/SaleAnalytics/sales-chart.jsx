'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });

const GRID = 'rgba(226,232,240,0.6)';

const CURRENCIES = [
  { key: 'NGN', label: '₦ NGN', color: '#fc5353', bg: 'rgba(252,83,83,0.10)', prefix: '₦' },
  { key: 'USD', label: '$ USD', color: '#16a34a', bg: 'rgba(22,163,74,0.10)',  prefix: '$' },
];

export default function SalesChart({ labels, dataNGN, dataUSD }) {
  const [active, setActive] = useState('NGN');
  const c    = CURRENCIES.find((x) => x.key === active);
  const data = active === 'NGN' ? dataNGN : dataUSD;

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
          label: (ctx) => ` ${c.prefix}${Number(ctx.raw || 0).toLocaleString()}`,
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
          callback: (v) => `${c.prefix}${Number(v).toLocaleString()}`,
        },
      },
    },
    elements: {
      point: { radius: 0, hoverRadius: 5, hoverBackgroundColor: c.color, hoverBorderColor: '#fff', hoverBorderWidth: 2 },
      line:  { borderWidth: 2, tension: 0.4 },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  const chartData = {
    labels,
    datasets: [{ label: `${c.prefix} Earnings`, data, borderColor: c.color, backgroundColor: c.bg, fill: 'start' }],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {CURRENCIES.map((cur) => (
          <button
            key={cur.key}
            onClick={() => setActive(cur.key)}
            style={{
              height: 30, padding: '0 14px', borderRadius: 20, border: `1px solid ${active === cur.key ? cur.color : '#e2e8f0'}`,
              background: active === cur.key ? cur.color : '#fff',
              color: active === cur.key ? '#fff' : '#6b7280',
              fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {cur.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
