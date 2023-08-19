import { Badge, Button, Text, useColorModeValue } from "@chakra-ui/react";
import { BullFolio } from "bullfolio-types";
import Card from "components/card/Card";
import { useAlerts } from "contexts/AlertsContext";

const AlertBox = (props: { alert: BullFolio.Alert }) => {
  const { alert } = props;

  const textColor = useColorModeValue("navy.700", "white");
	const secondaryText = useColorModeValue('gray.700', 'white');

  const { deleteAlert } = useAlerts();

  return(
    <Card>
      <Text textColor={textColor} fontWeight="extrabold" fontSize={"xl"}>{alert.name}</Text>
      <Text textColor={secondaryText} mb="3">{alert.description}</Text>
      <Badge variant={"outline"} width="min-content">{alert.recurring ? "Recurring" : "One-Time"}</Badge>
      <Button variant="brand" w="100%" onClick={() => deleteAlert(alert.id)} mt="6">
        Delete Alert
      </Button>
    </Card>
  );
};

export default AlertBox;