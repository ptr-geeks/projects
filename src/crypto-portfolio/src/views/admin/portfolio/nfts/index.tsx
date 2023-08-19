import { Box } from "@chakra-ui/react"
import { BullFolio } from "bullfolio-types";
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import BundleAll from "components/bundle/BundleAll";
import Card from "components/card/Card";
import { links } from "helpers/links";
import { useState } from "react";
import NftsBalances from "./components/Table";

const NftsPage = () => {

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
          name: "NFTs"
        }]}
        additional={{ mb: "4" }}
      />
      <BundleAll setBundle={setBundle} />
      {bundle ? (
        <Card mt="4">
          <NftsBalances />
        </Card>
      ):null}
    </Box>
  );
};

export default NftsPage;