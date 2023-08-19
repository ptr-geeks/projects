import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

type ChartProps = {
  chartData: any[];
  chartOptions: any;
};

const PieChart: React.FC<ChartProps> = ({ chartData, chartOptions, ...rest }) => {
  const [state, setState] = useState({
    chartData: [],
    chartOptions: {},
  });

  useEffect(() => {
    setState({
      chartData: chartData,
      chartOptions: chartOptions,
    });
  }, [chartData, chartOptions]);

  return (
    <ReactApexChart
      options={state.chartOptions}
      series={state.chartData}
      type='pie'
      width='100%'
      height='60%'
			{...rest}
    />
  );
};

export default PieChart;