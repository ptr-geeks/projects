import { Box, Button, Flex, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { BullFolio } from "bullfolio-types";
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import CurrentBundle from "components/bundle/CurrentBundle";
import SelectBundle from "components/bundle/SelectBundle";
import Loading from "components/Loading/Loading";
import { usePortfolio } from "contexts/PortfolioContext";
import { useUser } from "contexts/UserContext";
import { useQuery } from "helpers/formatters";
import { links } from "helpers/links";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ContentOverview from "./components/Content";
import Card from "components/card/Card";
import BundleAll from "components/bundle/BundleAll";
import {GrTransaction} from "react-icons/gr";
import {RxTokens} from "react-icons/rx";

/**
 * display:
 *  bundle select (grid, select (click) on bundle to view)
 * THAN:
 *  name, addresses
 *  chart (value)
 *  value, profit (all time)
 *  pie chart
 *  balances (last few)
 *  transactions (last few)
 */


const PortfolioOverview = () => {

  const { userData } = useUser();
  const history = useHistory();
  const query = useQuery();
  const { getPortfolioData } = usePortfolio();

  const [bundle, setBundle] = useState<BullFolio.User.AddressBundle | null>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    const bundleId = query.get("bundleId");
    if(bundleId && userData) {
      const _bundle = userData.addressBundles[bundleId];
      if(_bundle) {
        setBundle(_bundle);
      }else{
        console.log("bundle not found");
      }
    }
  }, [query, userData]);

  useEffect(() => {
    if(bundle && userData) {
      (async () => {
        const res = await getPortfolioData(bundle.id);
        console.log(res);
        setPortfolioData(res);
      })();
    }
  }, [bundle, userData]);

  return(
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/#${links.home}`,
          name: "Top Coins"
        }, {
          href: `/`,
          name: "Portfolio Overview"
        }]}
        additional={{ mb: "4" }}
      />

      <BundleAll setBundle={setBundle} />

      {userData && bundle ? (
        <>
          <ContentOverview portfolioData={portfolioData} />
          <SimpleGrid columns={3} gap="25px" mt="4">
            <Card>
              <Flex>
                <Box>
                  <Text fontSize={"xl"} fontWeight="extrabold" mb="2">Token Balances</Text>
                  <Link href={`/#${links.balances}?bundleId=${bundle.id}`}>
                    <Button variant="darkBrand" w="100%">
                      View
                    </Button>
                  </Link>
                </Box>
              </Flex>
            </Card>
            <Card>
              <Flex>
                <Box>
                  <Text fontSize={"xl"} fontWeight="extrabold" mb="2">All Transactions</Text>
                  <Link href={`/#${links.transactions}?bundleId=${bundle.id}`}>
                    <Button variant="darkBrand" w={"100%"}>
                      View
                    </Button>
                  </Link>
                </Box>
              </Flex>
            </Card>
            {/*<Card>
              <Flex>
                <Box>
                  <Text fontSize={"xl"} fontWeight="extrabold" mb="2">NFTs</Text>
                  <Link href={`/#${links.nfts}?bundleId=${bundle.id}`}>
                    <Button variant="darkBrand" w={"100%"}>
                      View
                    </Button>
                  </Link>
                </Box>
              </Flex>
      </Card>*/}
          </SimpleGrid>
        </>
      ):null}
    </Box>
  );
};

export default PortfolioOverview;