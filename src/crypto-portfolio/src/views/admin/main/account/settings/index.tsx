
// Chakra imports
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import Connected from 'views/admin/main/account/settings/components/Connected';
import Delete from 'views/admin/main/account/settings/components/Delete';
import Information from 'views/admin/main/account/settings/components/Information';
import Newsletter from 'views/admin/main/account/settings/components/Newsletter';
import Password from 'views/admin/main/account/settings/components/Password';
import Profile from 'views/admin/main/account/settings/components/Profile';
import Sessions from 'views/admin/main/account/settings/components/Sessions';
import Socials from 'views/admin/main/account/settings/components/Socials';
import TwoFactor from 'views/admin/main/account/settings/components/TwoFactor';

export default function Settings() {
	// Chakra Color Mode
	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			{/* Main Fields */}
			<SimpleGrid mb='20px' columns={{ sm: 1, md: 1, lg: 2 }} spacing={{ base: '20px', xl: '20px' }}>
				{/* Column Left */}
				<Flex direction='column'>
					<Profile />
					<Information />
					<Socials />
					<Password />
				</Flex>
				{/* Column Right */}
				<Flex direction='column'>
					<TwoFactor mb='20px' />
					<Newsletter mb='20px' />
					<Sessions mb='20px' />
					<Connected mb='20px' />
					<Delete />
				</Flex>
			</SimpleGrid>
		</Box>
	);
}
