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
import { DurationData, LengthData } from 'types/modules';
import { toStringDateByFormatting } from 'utils/date';

interface ChartProps {
  data: DurationData[] | LengthData[];
  xkey: string;
}

function TimeSeriesChart({ data, xkey }: ChartProps) {
  const chartData = [{ value: 14, time: 1503617297689 }];

  const mockData = chartData.map((c) => {
    const t = new Date(c.time);
    const stampedTime = {
      ...c,
      date: t.toISOString(),
    };
    return stampedTime;
  });

  const formatXAxis = (t: number) => toStringDateByFormatting(t * 10000);
  return (
    <ResponsiveContainer width="95%" aspect={4}>
      <BarChart
        width={500}
        height={300}
        data={data ?? mockData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sesssionEnd" tickFormatter={formatXAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={xkey} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TimeSeriesChart;
