/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import {
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function TimeSeriesChart() {
  const chartData = [
    { value: 14, time: 1503617297689 },
    { value: 15, time: 1503616962277 },
    { value: 15, time: 1503616882654 },
    { value: 20, time: 1503613184594 },
    { value: 15, time: 1503611308914 },
  ];

  return (
    <ResponsiveContainer width="95%" aspect={4}>
      <ScatterChart>
        <XAxis
          dataKey="time"
          domain={['auto', 'auto']}
          name="Time"
          tickFormatter={(unixTime) => {
            const t = new Date(unixTime);
            return t.toLocaleString('en-US');
          }}
          type="number"
        />
        <YAxis dataKey="value" name="Value" />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Scatter
          data={chartData}
          line={{ stroke: '#eee' }}
          lineJointType="monotoneX"
          lineType="joint"
          name="Values"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default TimeSeriesChart;
