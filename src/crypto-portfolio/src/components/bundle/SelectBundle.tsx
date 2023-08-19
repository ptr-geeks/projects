import { Box, Button, Link, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react"
import { BullFolio } from "bullfolio-types";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import { links } from "helpers/links";
import Blockie from "react-blockies";


const SelectBundle = (props: { userData: BullFolio.User, onSelect: (bundle: BullFolio.User.AddressBundle) => void }) => {

  const { userData, onSelect } = props;

  const textColor = useColorModeValue("navy.700", "white");
  const bgColor = useColorModeValue("secondaryGray.100", "#0B1437");

  return(
    <Box mt="6">
      <Text textAlign={"center"} color={textColor} fontSize="5xl" fontWeight={"extrabold"} mb="4">
        Select Portfolio
      </Text>
      <SimpleGrid columns={3} gap="20px">
        {Object.keys(userData.addressBundles).map((key) => {
          return(
            <Card onClick={() => onSelect(userData.addressBundles[key])} cursor="pointer" _hover={{ transform:"scale(1.02)" }} h="fit-content">
              <Box width={"fit-content"} ml="auto" mr="auto" mb="4" p="2.5" rounded={"lg"} bgColor={bgColor}>
                <SimpleGrid columns={2} gap="10px">
                  {userData.addressBundles[key].addresses.map((address) => {
                    return(
                      <Blockie
                        seed={address}
                        size={10}
                        scale={5}
                      />
                    )
                  })}
                </SimpleGrid>
              </Box>
              <Text textAlign={"center"} color={textColor} fontSize="xl" fontWeight={"extrabold"} mb="-1">
                {userData.addressBundles[key].name}
              </Text>
              <Text textAlign={"center"}>
                {userData.addressBundles[key].addresses.length} Addresses
              </Text>
            </Card>
          )
        })}
      </SimpleGrid>
      {Object.keys(userData.addressBundles).length < 3 ? (
        <Box mt="4">
          <HSeparator />
          <Link href={`/#${links.profileOverview}`} mt="4">
            <Button variant={"darkBrand"} width="100%" mt="4">
              Create New Bundle
            </Button>
          </Link>
        </Box>
      ):null}
    </Box>
  );
};

export default SelectBundle;