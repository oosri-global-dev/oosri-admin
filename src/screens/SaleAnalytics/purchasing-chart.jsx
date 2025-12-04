'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});
export default function PurchasingChart({ increasing }) {
  const [data, setData] = useState(['']);
  const [bgColor, setBgColor] = useState('');
  const profit = increasing || false;

  const chartOptions = {
    resizeDelay: 2,
    responsive: true,
    aspectRatio: 4,

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
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    interaction: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
    hover: {
      mode: null,
      animationDuration: 0,
    },
    interaction: {
      intersect: false,
      mode: false,
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

  useEffect(() => {
    if (profit) {
      setBgColor('#ABE188');
    } else {
      setBgColor('#F76241');
    }
  }, [profit]);

  return (
    <Line
      options={chartOptions}
      height={'100px'}
      data={{
        labels: ['Jan', 'Feb', 'fn', 'Sn', 'SHr', 'yui', 'jgv'],
        datasets: [
          {
            label: 'Sales',
            fill: 'start',
            borderColor: bgColor,
            backgroundColor: bgColor,
            borderJoinStyle: 'round',
            capBezierPoints: false,
            data: [1, 1.8, 2, 1, 2, 1, 2],
          },
        ],
      }}
    />
  );
}
