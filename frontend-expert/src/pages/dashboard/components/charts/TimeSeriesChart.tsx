/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
  BarChart,
} from 'recharts';

function TimeSeriesChart() {
  const chartData = [
    { value: 14, time: 1503617297689 },
    { value: 15, time: 1503616962277 },
    { value: 0, time: 1503616882654 },
    { value: 20, time: 1503613184594 },
    { value: 15, time: 1503611308914 },
  ];

  const data = chartData.map((c) => {
    const t = new Date(c.time);
    const stampedTime = {
      ...c,
      date: t.toISOString(),
    };
    return stampedTime;
  });

  const formatXAxis = (t: string) => t.substring(0, 10);
  return (
    <ResponsiveContainer width="95%" aspect={4}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={formatXAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TimeSeriesChart;
