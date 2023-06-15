/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/require-default-props */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import { DurationData, LengthData } from 'types/modules';
import { toStringDateByFormatting, toStringTimeByFormatting } from 'utils/date';

interface ChartProps {
  data: DurationData[] | LengthData[];
  xkey: string[];
  labelFormatter?: (v: number | string, n: string) => string;
}

const CHART_COLOR = ['#0d6efd', '#0dcaf0', '#ffc107'];

function TimeSeriesChart({
  data,
  xkey,
  labelFormatter = (v, n) => `${n}: ${v}`,
}: ChartProps) {
  const chartData = [{ value: 14, time: 1503617297689 }];

  const mockData = chartData.map((c) => {
    const t = new Date(c.time);
    const stampedTime = {
      ...c,
      date: t.toISOString(),
    };
    return stampedTime;
  });

  return (
    <ResponsiveContainer width="95%" aspect={3}>
      <BarChart
        width={500}
        height={600}
        data={data ?? mockData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="sessionEnd"
          tickFormatter={(v) => toStringDateByFormatting(v)}
        />
        <YAxis />
        <Tooltip
          formatter={labelFormatter}
          labelFormatter={(v) =>
            `${toStringDateByFormatting(v)} ${toStringTimeByFormatting(v)} `
          }
        />

        {xkey.map((key, index) => (
          <Bar dataKey={key} fill={CHART_COLOR[index]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TimeSeriesChart;
