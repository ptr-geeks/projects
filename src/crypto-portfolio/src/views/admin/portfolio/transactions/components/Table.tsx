import { Box, Button, Center, Flex, Icon, Link, SimpleGrid, Spinner, Switch, Text, useColorModeValue } from "@chakra-ui/react"
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import { useQuery } from "helpers/formatters";
import { links } from "helpers/links";
import { useEffect, useState } from "react";
import Card from 'components/card/Card';
import { usePortfolio } from "contexts/PortfolioContext";
import { BullFolio } from "bullfolio-types";
import { useUser } from "contexts/UserContext";
import { TokenProp } from "components/row/BalanceRow";
import SearchHeader from "components/search/SearchHeader";
import numeral from "numeral";
import TransactionRow, { TransactionProp } from "components/row/TransactionRow";


const Transactions = () => {

  const textColorSecondary = useColorModeValue('gray.500', 'gray.300');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const mt = useColorModeValue("10", "4");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<BullFolio.PortfolioData>(null);
  const [chain, setChain] = useState<string>("all");
  const [transactions, setTransactions] = useState<TransactionProp[]>([]);
  const [bundle, setBundle] = useState<BullFolio.User.AddressBundle>(null);

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
      const _txs: TransactionProp[] = [];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      portfolioData.transactions.forEach((transactionsForAddress) => {
        transactionsForAddress.forEach((transactionsForChain) => {
          const chainId = transactionsForChain.chain_id;
          transactionsForChain.result.forEach((tx) => {
            if ((searchTerm.length === 0 || tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) || tx.to_address.toLowerCase().includes(searchTerm.toLowerCase()) || tx.from_address.toLowerCase().includes(searchTerm.toLowerCase()))
              && (chain === "all" || chain === chainId)
            ) {
              const date = new Date(tx.block_timestamp);
              _txs.push({
                chain: chainId,
                fromAddress: tx.from_address,
                toAddress: tx.to_address,
                hash: tx.hash,
                date: date.getTime()
              });
            }        
          });
        });
      });
      _txs.sort((a, b) => Number(a.date) - Number(b.date)).reverse();
      _txs.forEach((tx, index) => {
        const date = new Date(Number(tx.date));
        _txs[index].date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      });
      setTransactions(_txs);
    }
  }, [portfolioData, chain, searchTerm]);

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
      <Text ml="2" mb="2" fontSize={"2xl"} fontWeight={"extrabold"} color={textColorSecondary}>Transactions</Text>
      <SearchHeader
        balances={false}
        bundleId={bundle?.id}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {portfolioData ? (
        transactions.map((tx: any) => {
          return(
            <TransactionRow
              tx={tx}
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
            <Text textAlign={"center"}>Loading Transactions. . .</Text>
          </Center>
        </Card>
      ):null}
    </Box>
  );
};

export default Transactions;