/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from 'recharts';

function TimeSeriesChart() {
  const chartData = [
    { value: 14, time: 1503617297689 },
    { value: 15, time: 1503616962277 },
    { value: 15, time: 1503616882654 },
    { value: 20, time: 1503613184594 },
    { value: 15, time: 1503611308914 },
  ];

  const data = chartData.map((c) => {
    const t = new Date(c.time);
    const stampedTime = { ...c, date: t.toLocaleString('en-US') };
    return stampedTime;
  });

  return (
    <ResponsiveContainer width="95%" aspect={4}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TimeSeriesChart;
