import { Box, Text } from "@chakra-ui/react";
import { BullFolio } from "bullfolio-types";
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import Loading from "components/Loading/Loading";
import { useCoins } from "contexts/CoinsContext";
import { useUser } from "contexts/UserContext";
import { useQuery } from "helpers/formatters";
import { links } from "helpers/links";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Content from "./components/Content";


const CoinPage = () => {

  const { getCoinById, getCoinChart } = useCoins();
  const { user, userData } = useUser();
  const query = useQuery();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [coin, setCoin] = useState<BullFolio.CoinData | null>(null);

  useEffect(() => {
    const id = query.get("coinId");
    if(id && user && userData) {
      (async () => {
        const res = await getCoinById(id);
        setCoin(res);
        setIsLoading(false);
        if(!res) {
          console.log("redirect");
        }
      })();
    }else{
      history.push(`/#${links.home}`);
    }
  }, [query, user, userData]);

  return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/#${links.home}`,
          name: "Top Coins"
        }, {
          href: `/`,
          name: coin?.name || "Coin Overview"
        }]}
        additional={{ mb: "4" }}
      />
      {!isLoading && coin ? (
        <Content coin={coin} />
      ):(
        <Loading text="Loading coin data..." />
      )}
    </Box>
  )
};

export default CoinPage;