import { Box, SimpleGrid, Text } from "@chakra-ui/react"
import { BullFolio } from "bullfolio-types";
import Loading from "components/Loading/Loading";
import { useCoins } from "contexts/CoinsContext";
import { useUser } from "contexts/UserContext";
import { chainIdToTokenId } from "helpers/formatters";
import numeral from "numeral";
import { useState, useEffect } from "react";
import AddressesOverview, { RowObjAddresses } from "./AddressesOverview";
import PieChartAddresses from "./PieAddresses";
import PieChartBalances from "./PieChart";

const ContentOverview = (props: { portfolioData: BullFolio.PortfolioData }) => {

  const { portfolioData } = props;

  const { userData } = useUser();
  const { getAllCoins } = useCoins();

  const [tableData, setTableData] = useState<RowObjAddresses[] | null>(null);

  useEffect(() => {
    if(portfolioData) {
      (async () => {
        const _data: RowObjAddresses[] = [];
        let totalTokens = 0
        let totalNfts = 0;
        let totalTx = 0;

        const values: number[] = [];

        portfolioData.tokenBalances.map((dataForAddress, index) => {
          let value = 0;
          dataForAddress.map(dataForChain => {
            Object.keys(dataForChain.tokens).forEach(key => {
              const token = dataForChain.tokens[key];
              if(token) {
                const balance = Number(token.balance) / (10**Number(token.tokenDecimals));
                const hodlValue = Number((balance * token.usdPrice).toFixed(2));
                value += Number(hodlValue.toFixed(2));
              }
            })
          });
          values.push(value);
        });
        
        const tokens = await getAllCoins(1);

        portfolioData.nativeBalances.map((nativeBalance, index) => {
          let value = 0;
          nativeBalance.map(balance => {
            const token = tokens.find((val) => val.id === chainIdToTokenId(balance.chain));
            const _balance = Number(balance.balance);
            const hodlValue = Number((_balance * token.current_price).toFixed(2));
            value += Number(hodlValue.toFixed(2));
          });
          values[index] += value;
        });


        portfolioData.ens.forEach((data: string | null, index) => {
          let txs = 0;
          portfolioData.transactions[index].forEach(txPerChain => txs += Number(txPerChain.total) || txPerChain.result.length);
          let nfts = 0;
          portfolioData.nfts[index].forEach(nftsPerChain => nfts += Number(nftsPerChain.total) || nftsPerChain.result.length);
          let tokens = 0;
          portfolioData.tokenBalances[index].forEach((tokensPerChain) => {
            Object.keys(tokensPerChain.tokens).forEach((key) => {
              if (tokensPerChain.tokens[key].possible_spam) {
                tokens += 1;
              }
            });
          });
        
          totalTokens += tokens;
          totalNfts += nfts;
          totalTx += txs;

          _data.push({
            address: userData.addressBundles[portfolioData.bundleId].addresses[index],
            ens: data || "-",
            transactions: txs,
            nfts: nfts,
            tokens: tokens,
            totalValue: numeral(values[index]).format("$0,0.00"),
            chains: portfolioData.activeChains[index].map((chain) => `${chain.chain.toUpperCase()} `)
          });
        });

        // push total row
        _data.push({
          address: "Total",
          ens: "",
          totalValue: numeral(values.reduce((accumulator, currentValue) => accumulator + currentValue, 0)).format("$0,0.00"),
          tokens: totalTokens,
          nfts: totalNfts,
          transactions: totalTx,
          chains: ["0x1"]
        })
        setTableData(_data);
      })();
    } 
  }, [portfolioData]);

  return(
    <Box mt="6">
      {portfolioData ? (
        <>
          {tableData ? (
            <AddressesOverview
              tableData={tableData}
            />
          ):null}
          <SimpleGrid mt="6" columns={2} gap="20px">
            <PieChartBalances 
              data={portfolioData}
            />
            <PieChartAddresses
              data={portfolioData}
            />
          </SimpleGrid>
        </>
      ):(
        <Loading text="Loading Bundle Portfolio Data..." />      )}
    </Box>
  );
};

export default ContentOverview;