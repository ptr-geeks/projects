import { useEffect, useState } from "react";
import { Box, Flex, Icon, Image, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { useCoins } from "contexts/CoinsContext";
import { useUser } from "contexts/UserContext";
import TopNftsTable, { RowObjCoins } from "./components/TopNftsTable";
import { BullFolio } from "bullfolio-types";
import Card from "components/card/Card";
import numeral from "numeral";
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from "components/icons/IconBox";
import { MdBarChart } from "react-icons/md";
import { BsBellFill } from "react-icons/bs";
import { getCurrencySymbol } from "helpers/formatters";
import Loading from "components/Loading/Loading";


export default function TopNfts() {
	// Chakra Color Mode
	const paleGray = useColorModeValue('secondaryGray.400', 'whiteAlpha.100');
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

	const [nfts, setNfts] = useState<BullFolio.CoinData[] | null>(null);

	const { getAllNfts } = useCoins();
	const { user, userData } = useUser();

	const createTableData = (): RowObjCoins[] => {
		if(nfts) {
			return nfts.map(nft => {
				return ({
					id: nft.id.toString(),
					name: [nft.name, nft.symbol, nft.image],
					rank: nft.market_cap_rank.toString(),
					price: `${getCurrencySymbol(userData.baseCurrency)}${numeral(nft.current_price).format(`0,0.00`)}`,
					changeHour: nft.price_change_percentage_1h_in_currency?.toFixed(1) || "",
					changeDay: nft.price_change_percentage_24h_in_currency?.toFixed(1) || "",
					changeWeek: nft.price_change_percentage_7d_in_currency?.toFixed(1) || "",
					marketCap: `${getCurrencySymbol(userData.baseCurrency)}${numeral(nft.market_cap).format(`0,0.00`)}`,
				});
			});
		}
	};

	useEffect(() => {
		if(user && userData) {
			(async () => {
				const res = await getAllNfts();
				setNfts(res);
			})();
		}
	}, [user, userData]);

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			{nfts ? (
				<Card>
					<TopNftsTable tableData={[]} />
				</Card>
			) : (
				<Loading text="Loading nfts..." />
			)}
		</Box>
	);
}
