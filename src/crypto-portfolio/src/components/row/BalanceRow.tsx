// Chakra imports
import { As, Box, Flex, Icon, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import { getChainLogoById, getEllipsisTxt } from 'helpers/formatters';
import React from 'react';
import { BsClockHistory } from 'react-icons/bs';

export type TokenProp = {
  logo: string;
  name: string,
  ticker: string;
  chain: string;
  balance: string;
  usdValue: number | string;
}

export default function BalanceRow(props: { token: TokenProp }) {
	const { token } = props;

  const textColor = useColorModeValue('brands.900', 'white');
	const bgItem = useColorModeValue(
		{ bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
		{ bg: 'navy.700', boxShadow: 'unset' }
	);
	const textColorDate = useColorModeValue('secondaryGray.600', 'white');

	return (
    <Card _hover={bgItem} cursor={"pointer"} bg='transparent' boxShadow='unset' px='24px' py='21px' transition='0.2s linear'>
      <Flex direction={{ base: 'column' }} justify='center'>
        <Flex position='relative' align='center'>
          <Box borderRadius='20px' me='16px' h="65px" w="105px" display={"flex"} alignItems="center" pl="18px">
            <Image
              zIndex={1}
              src={token.logo}
            />
            <Box w="10" h="10" rounded={"full"} ml="6" mt="-2" pl="2" pt="2" zIndex={2}>
              <Image
                src={getChainLogoById(token.chain)}
              />
            </Box>
          </Box>
          <Flex
            direction='column'
            w={{ base: '70%', md: '100%' }}
            me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}>
            <Text
              color={textColor}
              fontSize={{
                base: 'md'
              }}
              mb='5px'
              fontWeight='bold'
              me='14px'
            >
              {token.ticker}
            </Text>
            <Text
              color='secondaryGray.600'
              fontSize={{
                base: 'sm'
              }}
              fontWeight='400'
              me='14px'
            >
              {token.name}
            </Text>
          </Flex>
          <Flex me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }} align='center'>
            <Text fontWeight='700' fontSize='md' color={textColor}>
              {token.balance}
            </Text>
          </Flex>
          <Text ms='auto' fontWeight='700' fontSize='sm' color={textColorDate}>
            {token.usdValue}
          </Text>
        </Flex>
      </Flex>
    </Card>
	);
}
