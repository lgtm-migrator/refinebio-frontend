// @flow
import React from 'react';
import {
  ResponsiveContainer,
  LineChart as LineRechart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend
} from 'recharts';
import moment from 'moment';
import { COLORS } from '../../constants/colors';
import Spinner from '../Spinner';

type Props = {
  series: Array<string>,
  data: Array<{ date: string }>,
  isLoading: boolean
};

const LineChart = (props: Props) => {
  const { data = [], series = [], isLoading = false } = props;

  function formatXAxis(tickItem) {
    return moment(tickItem).format('MMM Do hh:mm');
  }

  if (isLoading) return <Spinner />;

  return (
    <ResponsiveContainer>
      <LineRechart
        data={data}
        height={400}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="date" tickFormatter={formatXAxis} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {series.map((set, i) => (
          <Line
            isAnimationActive={false}
            key={i}
            type="monotone"
            dataKey={set}
            stroke={COLORS[i]}
            strokeWidth={2}
          />
        ))}
      </LineRechart>
    </ResponsiveContainer>
  );
};

export default LineChart;
