import { Box, Button, Text, useColorModeValue } from "@chakra-ui/react";
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import { links } from "helpers/links";
import Card from "components/card/Card";
import InputField from "components/fields/InputField";
import TextFiled from "components/fields/TextField";

const CreateStrategyPage = () => {

  const textColor = useColorModeValue("navy.700", "white");

  return(
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/#${links.myStrategies}`,
          name: "My Strategies"
        }, {
          href: `/`,
          name: "Create"
        }]}
        additional={{ mb: "4" }}
      />
      <Card>
        <Text color={textColor} fontSize="xl" fontWeight={"900"} px="1" mb="3">
          Create Strategy
        </Text>
        <InputField
          label="Name"
          placeholder="My Strategy"
          mb="10px"
        />
        <TextFiled
          label="Description"
          placeholder="Your short description"
          mb="10px"
        />
        <Button width={"100%"} mt="3" variant={"darkBrand"}>
          Create
        </Button>
      </Card>
    </Box>
  );
};

export default CreateStrategyPage;