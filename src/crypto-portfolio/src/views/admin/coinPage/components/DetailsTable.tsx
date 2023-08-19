import { Box, Flex, Text } from "@chakra-ui/react";
import { BullFolio } from "bullfolio-types";
import { HSeparator } from "components/separator/Separator";
import { useUser } from "contexts/UserContext";
import numeral from "numeral";

const DetailsTable = (props: { coin: BullFolio.CoinData }) => {
  const { coin } = props;

  const { userData } = useUser();

  return(
    <Flex>
      <Box>
        <Flex justifyContent={"space-between"}>
          <Text>Market Cap:</Text>
          <Text>{numeral(coin.market_cap).format()}</Text>
        </Flex>
        <HSeparator />
      </Box>
      <Box>

      </Box>
    </Flex>
  );
};

export default DetailsTable;