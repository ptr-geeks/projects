import { Box, Flex, Select, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react"
import { BullFolio } from "bullfolio-types";
import Card from "components/card/Card";
import Blockies from "react-blockies";


/**
 * bundle image (zapper)
 * name
 * (under name, X addresses)
 * edit
 * on the rigth change bundle (dropown)
 */

const CurrentBundle = (props: { id: string, userData: BullFolio.User, handleChange: (bundle: BullFolio.User.AddressBundle) => void }) => {
  const textColor = useColorModeValue("navy.700", "white");

  const { id, userData, handleChange } = props;

  return(
    <Card py="3">
      <Flex justifyContent={"space-between"}>
        <Flex>
          <Flex mt="2.5" mr="3.5">
            {userData.addressBundles[id].addresses.map((address) => {
              return(
                <Box mr="3" rounded={"lg"}>
                  <Blockies
                    seed={address}
                    size={8}
                    scale={5}
                  />
                </Box>
              )
            })}
          </Flex>
          <Box>
            <Text color={textColor} fontSize='xl' fontWeight='800' mr="2" mt="1">
              {userData.addressBundles[id].name}
            </Text>
            <Text color={textColor} fontSize='md' fontWeight='500'>
              {userData.addressBundles[id].addresses.length} Addresses
            </Text>
          </Box>
        </Flex>
        <Box mt="2.5">
          <Select value={id} onChange={(e) => handleChange(userData.addressBundles[e.target.value])}>
            {Object.keys(userData.addressBundles).map(key => {
              return(
                <option
                  key={userData.addressBundles[key].id}
                  value={userData.addressBundles[key].id}
                >
                  {userData.addressBundles[key].name}
                </option>
              )
            })}
          </Select>
        </Box>
      </Flex>
    </Card>
  );
};

export default CurrentBundle;