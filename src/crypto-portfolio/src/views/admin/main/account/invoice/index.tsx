
// Chakra imports
import { Flex } from '@chakra-ui/react';

// Custom components
import Card from 'components/card/Card';
import Banner from 'views/admin/main/account/invoice/components/Banner';
import Content from 'views/admin/main/account/invoice/components/Content';

export default function Invoice() {
	// Chakra Color Mode
	return (
		<Card mt={{ base: '130px', md: '80px', xl: '80px' }} maxW='920px' mx='auto'>
			<Flex direction='column' width='stretch'>
				<Banner />
				<Content />
			</Flex>
		</Card>
	);
}
