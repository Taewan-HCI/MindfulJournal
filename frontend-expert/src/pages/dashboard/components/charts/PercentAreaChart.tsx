/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

const getPercent = (value: number, total: number) => {
  const ratio = total > 0 ? value / total : 0;

  return toPercent(ratio, 2);
};

const renderTooltipContent = (o: any) => {
  const { payload, label } = o;
  const total = payload.reduce(
    (result: number, entry: any) => result + entry.value,
    0,
  );

  return (
    <div className="bg-white bg-opacity-75 p-2">
      <p className="total">{`${label} (Total: ${total})`}</p>
      <ul className="list">
        {payload.map((entry: any) => (
          <li key={`item-${entry.name}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

function PercentAreaChart() {
  const data = [
    {
      month: '2015.01',
      중도: 2400,
      긍정: 2400,
      부정: 4000,
    },
    {
      month: '2015.02',
      중도: 1398,
      긍정: 2210,
      부정: 3000,
    },
    {
      month: '2015.03',
      중도: 500,
      긍정: 2400,
      부정: 2000,
    },
  ];

  return (
    <ResponsiveContainer width="80%" aspect={3}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        stackOffset="expand"
        margin={{
          top: 10,
          right: 30,
          left: 30,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={toPercent} />
        <Tooltip content={renderTooltipContent} />
        <Legend layout="vertical" verticalAlign="top" align="right" />
        <Area
          type="monotone"
          dataKey="부정"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="중도"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
        <Area
          type="monotone"
          dataKey="긍정"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default PercentAreaChart;
