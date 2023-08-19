import { Box } from "@chakra-ui/react"
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import Loading from "components/Loading/Loading";
import { useUser } from "contexts/UserContext";
import { links } from "helpers/links";
import AddressBundles from "views/admin/main/profile/overview/components/AddressBundles";

const BundlesPage = () => {

  const { userData } = useUser();

  return(
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/#${links.portfolioOverview}`,
          name: "Portfolio Overview"
        }, {
          href: "/",
          name: "Bundles"
        }]}
        additional={{ mb: "4" }}
      />
      {userData ? (
        <AddressBundles />
      ):(
        <Loading text="Loading Portfolio Bundles..." />
      )}
    </Box>
  );
};

export default BundlesPage;