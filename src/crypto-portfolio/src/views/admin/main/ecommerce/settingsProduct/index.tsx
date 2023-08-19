
// Chakra imports
import { Box, Flex, Image, SimpleGrid } from '@chakra-ui/react';
import ChairDef from 'assets/img/ecommerce/ChairDef.png';
// Custom components
import Card from 'components/card/Card';

import Delete from 'views/admin/main/ecommerce/settingsProduct/components/Delete';
import Details from 'views/admin/main/ecommerce/settingsProduct/components/Details';
import Dropzone from 'views/admin/main/ecommerce/settingsProduct/components/DropzoneCard';
import Info from 'views/admin/main/ecommerce/settingsProduct/components/Info';
import Socials from 'views/admin/main/ecommerce/settingsProduct/components/Socials';

export default function Settings() {
	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid columns={{ sm: 1, xl: 2 }} spacing={{ base: '20px', xl: '20px' }}>
				{/* Column Left */}
				<Flex direction='column'>
					<Card mb='20px'>
						<Image borderRadius='20px' h={{ base: 'auto', xl: '396px', '2xl': 'auto' }} src={ChairDef} />
					</Card>
					<Info />
				</Flex>
				{/* Column Right */}
				<Flex direction='column'>
					<Dropzone mb='20px' />
					<Socials mt='20px' />
				</Flex>
			</SimpleGrid>
			<Details />
			<Delete />
		</Box>
	);
}
