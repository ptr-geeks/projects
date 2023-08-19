import { Badge, Box, Flex, Icon, Image, Text, useColorModeValue } from "@chakra-ui/react"
import { BullFolio } from "bullfolio-types";
import { useUser } from "contexts/UserContext";
import { getCurrencySymbol } from "helpers/formatters";
import numeral from "numeral";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import Chart from "./Chart";

const Content = (props: { coin: BullFolio.CoinData }) => {
  const textColor = useColorModeValue("navy.700", "white");

  const { coin } = props;

  const { userData } = useUser();

  return (
    <Box px="4" mt="4">
      {/**
       * badge - rank
       * logo, name, ticker
       * price usd
       * range (high low)
       * table (mcap,volume,supply)
       */}
      <Badge colorScheme={"brand"}>Rank #{coin.market_cap_rank}</Badge>
      <Flex mt="4">
        <Image src={coin.image} width="65px" height={"65px"} alt="Coin logo" mr="3" rounded={"full"} />
        <Text color={textColor} fontSize='3xl' fontWeight='800' mr="3.5" mt="2.5">
          {coin.name}
        </Text>
        <Text color={textColor} fontSize='2xl' fontWeight='500' mt="4">
          {coin.symbol.toUpperCase()}
        </Text>
      </Flex>
      <Flex px="3">
        <Text color={textColor} fontSize='3xl' fontWeight='800' mr="3.5" mt="2.5">
          {getCurrencySymbol(userData.baseCurrency)} {numeral(coin.current_price).format("0,0.00")}
        </Text>
        <Text color={coin.price_change_percentage_24h>=0 ? "green.500" : "red.500"} fontSize='2xl' fontWeight='800' mt="3">
          {coin.price_change_percentage_24h.toFixed(2)} %
        </Text>
      </Flex>

      <Chart id={coin.id} coin={coin} />
    </Box>
  );
};

export default Content;