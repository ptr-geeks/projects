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


const TokenBalances = () => {

  const textColorSecondary = useColorModeValue('gray.500', 'gray.300');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const mt = useColorModeValue("10", "4");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<BullFolio.PortfolioData>(null);
  const [chain, setChain] = useState<string>("all");
  const [tokenBalances, setTokenBalances] = useState<TokenProp[]>([]);
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
      const _tokens: TokenProp[] = [];
      portfolioData.tokenBalances.forEach((tokenBalanceForAddress) => {
        tokenBalanceForAddress.forEach((balancesForChain) => {
          const chainId = balancesForChain.chain_id;
          Object.keys(balancesForChain.tokens).forEach((key) => {
            const _tokenData = balancesForChain.tokens[key];
            const balance = Number(_tokenData.balance) / (10**Number(_tokenData.tokenDecimals));
            const usdValue = _tokenData.usdPrice * balance;
            if ((searchTerm.length === 0 || _tokenData.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) || _tokenData.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
              && (chain === "all" || chain === chainId)
              && (!hideDust || usdValue > 5)
              && (_tokenData.possible_spam)
            ) {
              _tokens.push({
                  chain: chainId,
                  ticker: _tokenData.tokenSymbol,
                  name: _tokenData.tokenName,
                  balance: balance.toString(),
                  usdValue: usdValue,
                  logo: _tokenData.tokenLogo
              });
            }        
          });
        });
      })
      _tokens.sort((a, b) => Number(a.usdValue) - Number(b.usdValue)).reverse();
      _tokens.forEach((token, index) => {
        _tokens[index].usdValue = numeral(token.usdValue).format("$0,0.00");
      })
      setTokenBalances(_tokens);
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
      <Text ml="2" mb="2" fontSize={"2xl"} fontWeight={"extrabold"} color={textColorSecondary}>Token Balances</Text>
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
        <Text>Hide Dust (balances worth less than $5)</Text>
      </Flex>

      {portfolioData ? (
        tokenBalances.map((token: any) => {
          return(
            <BalanceRow
              token={token}
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
            <Text textAlign={"center"}>Loading Token Balances. . .</Text>
          </Center>
        </Card>
      ):null}
    </Box>
  );
};

export default TokenBalances;