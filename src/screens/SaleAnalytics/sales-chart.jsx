'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

export default function SalesChart({ labels, data }) {
  const chartOptions = {
    resizeDelay: 2,
    responsive: true,
    aspectRatio: 3,

    plugins: {
      filler: {
        propagate: false,
      },
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      chartAreaBorder: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 128, 128, 0.1)',
        },
      },
    },
    interaction: {
      intersect: false,
    },
    tooltip: {
      enabled: false,
    },
    hover: {
      mode: null,
      animationDuration: 0,
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 0,
      },
      line: {
        borderWidth: 1,
      },
    },
  };

  return (
    <Line
      options={chartOptions}
      data={{
        labels: labels,
        datasets: [
          {
            label: 'Sales',
            fill: 'start',
            borderJoinStyle: 'round',
            capBezierPoints: false,
            data: data,
          },
        ],
      }}
    />
  );
}
