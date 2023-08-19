import { useEffect, useState } from "react";
import { Box, Flex, Icon, Image, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { useCoins } from "contexts/CoinsContext";
import { useUser } from "contexts/UserContext";
import TopCoinsTable, { RowObjCoins } from "./components/TopCoinsTable";
import { BullFolio } from "bullfolio-types";
import Card from "components/card/Card";
import numeral from "numeral";
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from "components/icons/IconBox";
import { MdBarChart } from "react-icons/md";
import { BsBellFill } from "react-icons/bs";
import { getCurrencySymbol } from "helpers/formatters";
import Loading from "components/Loading/Loading";


export default function TopCoins() {
	// Chakra Color Mode
	const paleGray = useColorModeValue('secondaryGray.400', 'whiteAlpha.100');
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

	const [coins, setCoins] = useState<BullFolio.CoinData[] | null>(null);
	const [marketData, setMarketData] = useState<BullFolio.MarketData | null>(null);

	const { getAllCoins, getMarketData } = useCoins();
	const { user, userData } = useUser();

	const createTableData = (): RowObjCoins[] => {
		if(coins) {
			return coins.map(coin => {
				return ({
					id: coin.id.toString(),
					name: [coin.name, coin.symbol, coin.image],
					rank: coin.market_cap_rank.toString(),
					price: `${getCurrencySymbol(userData.baseCurrency)}${numeral(coin.current_price).format(`0,0.00`)}`,
					changeHour: coin.price_change_percentage_1h_in_currency?.toFixed(1) || "",
					changeDay: coin.price_change_percentage_24h_in_currency?.toFixed(1) || "",
					changeWeek: coin.price_change_percentage_7d_in_currency?.toFixed(1) || "",
					marketCap: `${getCurrencySymbol(userData.baseCurrency)}${numeral(coin.market_cap).format(`0,0.00`)}`,
				});
			});
		}
	};

	useEffect(() => {
		if(user && userData) {
			(async () => {
				const res = await getAllCoins(1);
				setCoins(res);
				const _marketData = await getMarketData();
				setMarketData(_marketData);
				console.log(marketData)
			})();
		}
	}, [user, userData]);

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			{coins ? (
				<Box>
					{marketData ? (
						<SimpleGrid columns={{ base: 2, md: 2, lg: 4, '2xl': 4 }} gap='20px' mb='6'>
							<MiniStatistics
								startContent={
									<IconBox
										w='56px'
										h='56px'
										bg={boxBg}
										icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />}
									/>
								}
								name='Total Market Cap'
								value={numeral(marketData.market_cap_usd).format("$0 ,0 .00")}
							/>
							<MiniStatistics
								endContent={
									<Image
										w='56px'
										h='56px'
										src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
									/>
								}
								name='Bitcoin Dominance'
								value={`${marketData.bitcoin_dominance_percentage}%`}
							/>
							<MiniStatistics
								startContent={
									<IconBox
										w='56px'
										h='56px'
										bg={boxBg}
										icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />}
									/>
								}
								name='Volume 24H'
								value={numeral(marketData.volume_24h_usd).format("$0,0.00")}
							/>
							<MiniStatistics
								startContent={
									<IconBox
										w='56px'
										h='56px'
										bg={boxBg}
										icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />}
									/>
								}
								name='# of Coins'
								value={marketData.cryptocurrencies_number}
							/>
						</SimpleGrid>
					):null}
					<Card>
						<TopCoinsTable tableData={createTableData()} />
					</Card>
				</Box>
			) : (
				<Loading text="Loading coins..." />
			)}
		</Box>
	);
}
