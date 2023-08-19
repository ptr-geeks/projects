import { Box, Text } from "@chakra-ui/react";
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import { links } from "helpers/links";

const StrategyMarketplace = () => {
  return(
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/`,
          name: "Marketplace"
        }]}
        additional={{ mb: "4" }}
      />
      <Text>
        Strategy Marketplace
      </Text>
    </Box>
  );
};

export default StrategyMarketplace;