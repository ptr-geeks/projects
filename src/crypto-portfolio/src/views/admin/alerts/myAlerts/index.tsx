import { Box, Button, Link, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import { BullFolio } from "bullfolio-types";
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import Card from "components/card/Card";
import Loading from "components/Loading/Loading";
import { useAlerts } from "contexts/AlertsContext";
import { useUser } from "contexts/UserContext";
import { links } from "helpers/links";
import { useEffect, useState } from "react";
import AlertBox from "./components/AlertBox";

const MyAlertsPage = () => {
  const textColor = useColorModeValue("navy.700", "white");

  const { getAllAlerts } = useAlerts();
  const { userData } = useUser();

  const [alerts, setAlerts] = useState<BullFolio.Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(userData) {
      (async () => {
        setIsLoading(true);
        const res = await getAllAlerts();
        console.log(res);
        setAlerts(res);
        setIsLoading(false);
      })();
    }
  }, [userData]);

  return(
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/`,
          name: "My Alerts"
        }]}
        additional={{ mb: "4" }}
      />
      <Card mb="6">
        <Text textColor={textColor} fontSize="2xl" fontWeight={"extrabold"}>
          My Alerts
        </Text>
        <Text textColor={textColor}>
          Alert Limit: 3.
        </Text>
      </Card>
      {!isLoading ? (
        <>
          {alerts?.length>0 ? (
            <SimpleGrid columns={3} gap="20px">
              {alerts.map(alert => {
                return (
                  <Box key={alert.id}>
                    <AlertBox alert={alert} />
                  </Box>
                )
              })}
            </SimpleGrid>
          ):(
            <Card>
              <Text textAlign={"center"}>No Alert Found.</Text>
            </Card>
          )}
          {alerts.length>0 && alerts.length<3 ? (
            <Link href={`/#${links.createAlert}`}>
              <Button variant={"darkBrand"} w="100%" mt="12">
                Create Alert
              </Button>
            </Link>
          ):(
            <Card mt="12">
              <Text textAlign={"center"}>Alerts Limit Reached.</Text>
            </Card>
          )}
        </>
      ):(
        <Loading text="Getting your alerts..."/>
      )}
    </Box>
  );
};

export default MyAlertsPage;