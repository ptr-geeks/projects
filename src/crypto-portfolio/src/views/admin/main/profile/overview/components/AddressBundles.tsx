import { Box, Button, Flex, SimpleGrid, Text, useColorModeValue, useToast } from "@chakra-ui/react"
import { BullFolio } from "bullfolio-types";
import Card from "components/card/Card";
import { useUser } from "contexts/UserContext";
import { useEffect, useState } from "react";
import InputField from "components/fields/InputField";
import { IoMdTrash } from "react-icons/io";
import { generateUID, getToast } from "helpers/formatters";
import { FiTrash } from "react-icons/fi";
import { HSeparator } from "components/separator/Separator";
import Loading from "components/Loading/Loading";

const AddressBundles = () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [bundles, setBundles] = useState<{ [name: string]: BullFolio.User.AddressBundle }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { userData, editBundles } = useUser();
  const toast = useToast();

  const changeBundleName = (val: string, key: string) => {
    const updatedBundles = { ...bundles };
    updatedBundles[key] = { ...updatedBundles[key], name: val };
    setBundles(updatedBundles);
  }

  const changeBundleAddress = (val: string, key: string, index: number) => {
    const updatedBundles = { ...bundles };
    updatedBundles[key].addresses[index] = val;
    setBundles(updatedBundles);
  }

  const addBundleAddress = (key: string) => {
    const updatedBundles = { ...bundles };
    updatedBundles[key].addresses.push("");
    setBundles(updatedBundles);
  }

  const removeBundleAddress = (key: string, index: number) => {
    if(bundles[key].addresses.length>1) {
      const updatedBundles = { ...bundles };
      updatedBundles[key].addresses.splice(index, 1);
      setBundles(updatedBundles);
    }
  }

  const addBundle = () => {
    const updatedBundles = { ...bundles };
    updatedBundles[generateUID()] = {
      name: "",
      id: "",
      addresses: [""]
    };
    setBundles(updatedBundles);
  }

  const removeBundle = (key: string) => {
    const updatedBundles = { ...bundles };
    delete updatedBundles[key];
    setBundles(updatedBundles);
  }

  const handleSaveChanges = async () => {
    if(bundles === userData.addressBundles) {
      toast(getToast("info", "No changes made", "No changes made, nothing to save."));
    }else{
      setIsLoading(true);
      await editBundles(bundles);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(userData) {
      setBundles(userData.addressBundles);
    }
  }, [userData]);

  return(
    <Card>
      <Flex align='center' w='100%' justify='space-between' mb='10px'>
				<Text color={textColor} fontWeight='bold' fontSize='2xl' mb='4px'>
					Portfolio Bundles
				</Text>
			</Flex>
      <Text>Manage addresses you want to track in your portfolio.</Text>

      {isLoading ? (
        <Loading text="Saving changes..." />
      ):(
        <Box>
          <Box mt="2" mb="3">
            {Object.keys(bundles).map((key) => {
              return(
                <Card mb="6">
                  <InputField
                    label="Nickname"
                    value={bundles[key].name}
                    onChange={(e: any) => changeBundleName(e.target.value, key)}
                  />

                  <SimpleGrid columns={{ base: 2, sm: 1, xl: 2 }} gap='5px'>
                    {bundles[key].addresses.map((address, index) => {
                      return(
                        <Flex width={"100%"}>
                          <InputField
                            label="Address"
                            value={address}
                            width="max-content"
                            onChange={(e: any) => changeBundleAddress(e.target.value, key, index)}
                          />
                          <Button onClick={() => removeBundleAddress(key, index)} mt="8">
                            <FiTrash />
                          </Button>
                        </Flex>
                      )
                    })}
                  </SimpleGrid>

                  {bundles[key].addresses.length < 4 ? (
                    <Button onClick={() => addBundleAddress(key)}>
                      Add New Address
                    </Button>
                  ):(
                    <Text fontSize={"sm"}>Address Limit reached.</Text>
                  )}

                  <Button onClick={() => removeBundle(key)}>
                    Delete Bundle
                  </Button>
                </Card>
              )
            })}

            {Object.keys(bundles).length<5 ? (
              <Button onClick={addBundle} variant="brand" width={"100%"}>Add New</Button>
            ):(
              <Text>Bundle Limit Reached</Text>
            )}
          </Box>

          <HSeparator />

          <Button onClick={handleSaveChanges} variant="darkBrand" mt="4" width={"100%"}>
            Save Changes
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default AddressBundles;