// Chakra imports
import { As, Box, Flex, Icon, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import { getChainExplorer, getChainLogoById, getChainName, getEllipsisTxt } from 'helpers/formatters';
import React from 'react';
import Blockie from "react-blockies";
import { FiExternalLink } from 'react-icons/fi';

export type TransactionProp = {
  fromAddress: string;
  toAddress: string;
  chain: string;
  hash: string;
  date: string | number;
}

export default function TransactionRow(props: { tx: TransactionProp }) {
	const { tx } = props;

  const textColor = useColorModeValue('brands.900', 'white');
	const bgItem = useColorModeValue(
		{ bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
		{ bg: 'navy.700', boxShadow: 'unset' }
	);
	const textColorDate = useColorModeValue('secondaryGray.600', 'white');

  const createLink = () => {
    return `${getChainExplorer(tx.chain)}tx/${tx.hash}`;
  }

	return (
    <Link href={createLink()} isExternal={true}>
      <Card _hover={bgItem} cursor={"pointer"} bg='transparent' boxShadow='unset' px='24px' py='21px' transition='0.2s linear'>
        <Flex direction={{ base: 'column' }} justify='center'>
          <Flex position='relative' align='center'>
            <Box borderRadius='20px' me='16px' h="65px" w="105px" display={"flex"} alignItems="center" pl="18px">
              <Image
                src={getChainLogoById(tx.chain)}
              />
            </Box>
            <Flex
              direction='column'
              w={{ base: '70%', md: '100%' }}
              me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}>
              <Flex>
                <Blockie
                  seed={tx.fromAddress}
                  size={5}
                  scale={6}
                />
                <Text
                  color={textColor}
                  fontSize={{
                    base: 'md'
                  }}
                  mb='5px'
                  fontWeight='bold'
                  me='14px'
                  ml="2"
                  >
                  From: {getEllipsisTxt(tx.fromAddress, 8)}
                </Text>
              </Flex>
              <Text
                color='secondaryGray.600'
                fontSize={{
                  base: 'sm'
                }}
                fontWeight='400'
                me='14px'
              >
                {getChainName(tx.chain)}
              </Text>
            </Flex>
            <Flex me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }} align='center'>
              <Blockie
                seed={tx.toAddress}
                size={5}
                scale={6}
              />
              <Text fontWeight='700' fontSize='md' color={textColor} ml="2">
                To: {getEllipsisTxt(tx.toAddress, 8)}
              </Text>
            </Flex>
            <Text mx="6">
              {tx.date}
            </Text>
            <FiExternalLink />
          </Flex>
        </Flex>
      </Card>
    </Link>
	);
}
