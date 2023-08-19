import { Box } from "@chakra-ui/react"
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import BundleAll from "components/bundle/BundleAll";
import { links } from "helpers/links";
import Card from "components/card/Card";
import Transactions from "./components/Table";
import { useState } from "react";
import { BullFolio } from "bullfolio-types";

const TransactionsPage = () => {
  const [bundle, setBundle] = useState<BullFolio.User.AddressBundle>(null);

  return(
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/#${links.home}`,
          name: "Top Coins"
        }, {
          href: `/#${links.portfolioOverview}`,
          name: "Portfolio Overview"
        }, {
          href: `/`,
          name: "Transactions"
        }]}
        additional={{ mb: "4" }}
      />
      <BundleAll setBundle={setBundle} />
      {bundle ? (
        <Card mt="4">
          <Transactions />
        </Card>
      ):null}
    </Box>
  );
};

export default TransactionsPage;