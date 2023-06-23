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
  Legend,
  ComposedChart,
  Line,
} from 'recharts';
import { DurationData, PHQData } from 'types/modules';
import { toStringDateByFormatting, toStringTimeByFormatting } from 'utils/date';

interface ChartProps {
  data: DurationData[] | PHQData[];
  xkey: string[];
  labelFormatter?: (v: number | string, n: string) => string;
}

const CHART_COLOR = ['#0d6efd', '#0dcaf0', '#ffc107'];
const Y_AXIS = ['left', 'right'];

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
    <ResponsiveContainer width="95%" aspect={2}>
      <ComposedChart
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
        <Tooltip
          formatter={labelFormatter}
          labelFormatter={(v) =>
            `${toStringDateByFormatting(v)} ${toStringTimeByFormatting(v)} `
          }
        />

        {xkey.length >= 2 ? (
          <>
            <Bar dataKey={xkey[1]} fill={CHART_COLOR[1]} yAxisId={Y_AXIS[1]} />
            <Line
              type="linear"
              dataKey={xkey[0]}
              stroke={CHART_COLOR[0]}
              yAxisId={Y_AXIS[0]}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: xkey[0],
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: xkey[1],
                angle: 90,
                offset: 10,
                position: 'insideRight',
              }}
            />
          </>
        ) : (
          <>
            <Bar dataKey={xkey[0]} fill={CHART_COLOR[0]} />
            <YAxis />
          </>
        )}

        <Legend />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default TimeSeriesChart;
