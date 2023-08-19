import { Box, Flex, Select, Text } from "@chakra-ui/react"
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { BullFolio } from "bullfolio-types";
import { useCoins } from "contexts/CoinsContext";

const Chart = (props: { id: string, coin: BullFolio.CoinData }) => {

  const { id, coin } = props;
  const { getCoinChart } = useCoins();

  const [timeframe, setTimeframe] = useState(12);
  const [data, setData] = useState<BullFolio.CoinChart | null>();

  const [chartSeries, setChartSeries] = useState<any[]>([{
    data: []
  }]);

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      type: "candlestick",
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  });

  useEffect(() => {
    if(id) {
      (async () => {
        console.log("getting, ", id)
        const res = await getCoinChart(`coingecko:${id}`);
        setData(res);
      })();
    }
  }, [id]);

  useEffect(() => {
    if(data && timeframe) {
      const result = [];
      for (let i = 0; i < data.chart.prices.length; i += timeframe) {
        const previousLastPrice: any = result.length > 0 ? result[result.length - 1].y[3] : null;
      
        const group = data.chart.prices.slice(i, i + timeframe);
      
        const firstPrice = previousLastPrice !== null ? previousLastPrice : group[0].price;
        const highestPrice = Math.max(...group.map(entry => entry.price));
        const lowestPrice = Math.min(...group.map(entry => entry.price));
        const lastPrice = group[group.length - 1].price;
        const timestampOfFirstInGroup = group[0].timestamp;
      
        result.push({
          y: [firstPrice, highestPrice, lowestPrice, lastPrice],
          x: timestampOfFirstInGroup*1000
        });
      }
      setChartSeries([{
        data: result
      }]);
    }
  }, [timeframe, data]);

  useEffect(() => {
    if(chartSeries) setChartOptions({
      chart: {
        type: "candlestick",
        height: 350
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    });
  }, [chartSeries]);

  useEffect(() => {
    if(chartOptions && chartSeries) console.log(chartOptions, chartSeries);
  }, [chartOptions, chartSeries]);

  return (
    <Box>
      <Flex justifyContent={"space-between"} px="2.5" mb="3" mt="8">
        <Text fontSize={"xl"} fontWeight={"800"}>
          {coin.symbol.toUpperCase()} / USD
        </Text>
        <Flex>
          <Text fontSize={"lg"} fontWeight={"500"} mt="1.5">Candle Timeframe</Text>
          <Select width={"fit-content"} defaultValue={timeframe} onChange={(e) => setTimeframe(Number(e.target.value))} ml="2">
            <option value={4}>4 H</option>
            <option value={6}>6 H</option>
            <option value={12}>12 H</option>
            <option value={24}>1 D</option>
            <option value={48}>2 D</option>
            <option value={72}>3 D</option>
            <option value={96}>4 D</option>
            <option value={120}>5 D</option>
            <option value={168}>1 W</option>
            <option value={336}>2 W</option>
          </Select>
        </Flex>
      </Flex>

      <div id="chart">
        <ReactApexChart options={chartOptions} series={chartSeries} type="candlestick" height={350} />
      </div>
    </Box>
  );
};

export default Chart;