import { Box, Flex, Select, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react"
import { BullFolio } from "bullfolio-types";
import PieChart from "components/charts/PieChart";
import { chainIdToTicker, chainIdToTokenId, generateHexColorFromString } from "helpers/formatters";
import { useEffect, useState } from "react";
import Card from "components/card/Card";
import { VSeparator } from "components/separator/Separator";
import { useCoins } from "contexts/CoinsContext";
import numeral from "numeral";


const PieChartBalances = (props: { data: BullFolio.PortfolioData }) => {
  const { data } = props;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const cardColor = useColorModeValue('white', 'navy.700');
	const cardShadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'unset');

  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  const { getAllCoins } = useCoins();

  useEffect(() => {
    if(data) {
      (async () => {
        const tokenNames: string[] = [];
        const values: number[] = [];
        const colors: string[] = [];

        data.tokenBalances.map(dataForAddress => {
          dataForAddress.map(dataForChain => {
            Object.keys(dataForChain.tokens).forEach(key => {
              const token = dataForChain.tokens[key];
              if(token) {
                tokenNames.push(token?.tokenSymbol.toUpperCase());
                const balance = Number(token.balance) / (10**Number(token.tokenDecimals));
                const hodlValue = Number((balance * token.usdPrice).toFixed(2));
                values.push(Number(hodlValue.toFixed(2)));
                // generate color from address (so that it is always the same)
                colors.push(generateHexColorFromString(token.tokenAddress));
              }
            })
          })
        });

        const tokens = await getAllCoins(1);

        data.nativeBalances.map(nativeBalance => {
          nativeBalance.map(balance => {
            const token = tokens.find((val) => val.id === chainIdToTokenId(balance.chain));
            tokenNames.push(chainIdToTicker(balance.chain));
            const _balance = Number(balance.balance);
            const hodlValue = Number((_balance * token.current_price).toFixed(2));
            values.push(Number(hodlValue.toFixed(2)));
            // generate color from address (so that it is always the same)
            colors.push(generateHexColorFromString(token.id));
          });
        });

        // Create an array of objects containing numbers, tickers, and colors
        const combinedArray = values.map((number, index) => ({
          number,
          ticker: tokenNames[index],
          color: colors[index],
        }));

        // Sort the combined array based on numbers
        combinedArray.sort((a, b) => a.number - b.number).reverse();

        // Extract the sorted tickers and colors back into separate arrays
        const sortedTickers = combinedArray.map(item => item.ticker);
        const sortedColors = combinedArray.map(item => item.color);
        const sortedNumbers = combinedArray.map(item => item.number);

        // If the array has more than 10 elements, calculate the sum of the rest of the numbers
        if (sortedNumbers.length > 10) {
          const sumRestOfNumbers = sortedNumbers.slice(10).reduce((sum, num) => sum + num, 0);
          sortedNumbers[9] = sumRestOfNumbers;
          sortedTickers[9] = 'OTHER';
          sortedColors[9] = 'gray';

          // Remove elements behind index 9 (inclusive)
          sortedNumbers.splice(10);
          sortedTickers.splice(10);
          sortedColors.splice(10);
        }      

        const pieChartOptions = {
          labels: sortedTickers,
          colors: sortedColors,
          chart: {
            width: '1000px',
            innerHeight: "1000px",
          },
          states: {
            hover: {
              filter: {
                type: 'none'
              }
            }
          },
          legend: {
            show: false
          },
          dataLabels: {
            enabled: false
          },
          // hover: { mode: null },
          plotOptions: {
            donut: {
              expandOnClick: false,
              donut: {
                labels: {
                  show: false
                }
              }
            }
          },
          fill: {
            colors: sortedColors,
          },
          tooltip: {
            enabled: true,
            theme: 'light'
          }
        };
        
        setChartData(sortedNumbers);
        setChartOptions(pieChartOptions);
      })();
    }
  }, [data]);

  return(
    <Card p='20px' alignItems='center' flexDirection='column' w='100%'>
			<Flex
				px={{ base: '0px', '2xl': '10px' }}
				justifyContent='space-between'
				alignItems='center'
				w='100%'
        height={"100%"}
				mb='8px'>
				<Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
					Balances - {numeral(chartData?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0).toFixed(0)).format("$0,0.00")}
				</Text>
			</Flex>

			{chartData && chartOptions ? (
        <PieChart
          chartData={chartData}
          chartOptions={chartOptions}
        />
      ):null}
			<Card
				bg={cardColor}
				flexDirection='row'
				boxShadow={cardShadow}
				w='100%'
				p='15px'
				px='20px'
				mt='15px'
				mx='auto'
      >
        <SimpleGrid columns={5} justifyContent="space-between">
          {chartOptions?.labels.map((label: string, index: number) => {
            return(
              <Box key={label}>
                <Flex direction='column' py='5px'>
                  <Flex align='center'>
                    <Box h='8px' w='8px' bg={chartOptions.colors[index]} borderRadius='50%' me='4px' />
                    <Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px'>
                      {label}
                    </Text>
                  </Flex>
                  <Text fontSize='lg' color={textColor} fontWeight='700'>
                    {numeral(chartData[index].toFixed(0)).format("$0,0.00")}
                  </Text>
                </Flex>
                <VSeparator mx={{ base: '60px', xl: '60px', '2xl': '60px' }} />
              </Box>
            )
          })}
        </SimpleGrid>
			</Card>
		</Card>
  );
};

export default PieChartBalances;