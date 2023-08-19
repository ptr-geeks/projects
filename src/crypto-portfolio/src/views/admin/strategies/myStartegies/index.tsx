import { Box, Text } from "@chakra-ui/react";
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import { links } from "helpers/links";

const MyStrategiesPage = () => {
  return(
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/`,
          name: "My Strategies"
        }]}
        additional={{ mb: "4" }}
      />
      <Text>
        My Strategies
      </Text>
    </Box>
  );
};

export default MyStrategiesPage;