import { Box, Button, Center, Flex, Icon, Link, SimpleGrid, Spinner, Switch, Text, useColorModeValue } from "@chakra-ui/react"
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import { useQuery } from "helpers/formatters";
import { links } from "helpers/links";
import { useEffect, useState } from "react";
import Card from 'components/card/Card';
import { usePortfolio } from "contexts/PortfolioContext";
import { BullFolio } from "bullfolio-types";
import { useUser } from "contexts/UserContext";
import BalanceRow, { TokenProp } from "components/row/BalanceRow";
import SearchHeader from "components/search/SearchHeader";
import numeral from "numeral";
import NFT from "components/card/NFT";

interface NftProp {
  image: string;
  chainId: string;
}

const NftsBalances = () => {

  const textColorSecondary = useColorModeValue('gray.500', 'gray.300');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const mt = useColorModeValue("10", "4");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<BullFolio.PortfolioData>(null);
  const [chain, setChain] = useState<string>("all");
  const [nfts, setNfts] = useState<NftProp[]>([]);
  const [bundle, setBundle] = useState<BullFolio.User.AddressBundle>(null);
  const [hideDust, setHideDust] = useState(true);

  const query = useQuery();
  const { userData } = useUser();
  const { getPortfolioData } = usePortfolio();

  useEffect(() => {
    if(query.get("chain")) {
      const chainId: string = (query.get("chain") || "all");
      setChain(chainId);
    }
  }, [query]);

  useEffect(() => {
    if(portfolioData) {
      const _nfts: NftProp[] = [];
      portfolioData.nfts.forEach((nftsForAddress) => {
        nftsForAddress.forEach((nftsForChain) => {
          const chainId = nftsForChain.chain_id;
          nftsForChain.result.forEach((nft) => {  
            _nfts.push({
              image: JSON.parse(nft.metadata)?.image || "",
              chainId: chainId
            });
          });
        });
      }) ;
      setNfts(_nfts);
    }
  }, [portfolioData, chain, searchTerm, hideDust]);

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
        setPortfolioData(res);
      })();
    }
  }, [bundle, userData]);

  return(
    <Box>
      <Text ml="2" mb="2" fontSize={"2xl"} fontWeight={"extrabold"} color={textColorSecondary}>NFTs</Text>
      <SearchHeader
        balances={true}
        bundleId={bundle?.id}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Flex px="2.5">
        <Switch
          isChecked={hideDust}
          onChange={() => setHideDust(!hideDust)}
          mr="2"
          mt="0.5"
        />
        <Text>Hide Possible Spam</Text>
      </Flex>

      {portfolioData ? (
        nfts.map((nft: any) => {
          return(
            <NFT
              image={nft.image}
              name=""
              author=""
              bidders={[]}
              download=""
              currentbid={""}
            />
          )
        })
      ):null}

      {!portfolioData ? (
        <Card>
          <Center mx="auto" flexDirection={"column"}>
            <Spinner
              thickness='10px'
              speed='0.65s'
              emptyColor='gray.200'
              color='brand.500'
              size="xl"
              mx="auto"
              />
            <Text textAlign={"center"}>Loading NFTs. . .</Text>
          </Center>
        </Card>
      ):null}
    </Box>
  );
};

export default NftsBalances;