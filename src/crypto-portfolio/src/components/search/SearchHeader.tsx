import { Box, Flex, Link, Text, useColorModeValue } from "@chakra-ui/react"
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import { links } from "helpers/links";

const SearchHeader = (props: { balances: boolean, bundleId: string, searchTerm: string; setSearchTerm: (newTerm: string) => void; }) => {

  const { balances, searchTerm, bundleId, setSearchTerm } = props;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorBrand = useColorModeValue('brand.500', 'white');

  const getLink = (type: string) => {
    return `/#${balances ? links.balances : links.transactions}?bundleId=${bundleId}&chain=${type}`;
  }

  return(
    <Box>
      <Flex direction='column'>
        <Flex
          mb='20px'
          justifyContent='space-between'
          direction={{ base: 'column', lg: 'row' }}
          align={{ base: 'start', lg: 'center' }}
        >
          <Box pr="20px" w="100%">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              w="100%"
            />
          </Box>
          <Flex
            align='center'
            mx="20px"
            ms={{ base: '24px', lg: '0px' }}
            mt={{ base: '20px', lg: '0px' }}>
            <Link
              color={textColorBrand}
              fontWeight='500'
              me={{ base: '34px', lg: '44px' }}
              href={getLink("all")}>
              All
            </Link>
            <Link
              color={textColorBrand}
              fontWeight='500'
              me={{ base: '34px', lg: '44px' }}
              href={getLink("0x1")}>
              Ethereum
            </Link>
            <Link
              color={textColorBrand}
              fontWeight='500'
              me={{ base: '34px', lg: '44px' }}
              href={getLink("0x38")}>
              BNBChain
            </Link>
            <Link
              color={textColorBrand}
              fontWeight='500'
              me={{ base: '34px', lg: '44px' }}
              href={getLink("0x89")}>
              Polygon
            </Link>
            <Link
              color={textColorBrand}
              fontWeight='500'
              me={{ base: '34px', lg: '44px' }}
              href={getLink("0xa4b1")}>
              Arbitrum
            </Link>
            <Link
              color={textColorBrand}
              fontWeight='500'
              me={{ base: '34px', lg: '44px' }}
              href={getLink("0xa86a")}>
              Avalanche
            </Link>
            <Link
              color={textColorBrand}
              fontWeight='500'
              me={{ base: '34px', lg: '44px' }}
              href={getLink("0xfa")}>
              Fantom
            </Link>
          </Flex>
        </Flex>

        {searchTerm.length !== 0 ? (
          <>
            <Text mt='20px' mb='20px' color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
              Search Results for: <i>{searchTerm}</i>
            </Text>
          </>
        ):null}
      </Flex>
    </Box>
  );
};

export default SearchHeader;