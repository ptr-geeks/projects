
// Chakra imports
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
// Assets
import banner from 'assets/img/auth/banner.png';
import profile from 'assets/img/crm/vbz.png';

// Custom components
import Info from 'views/admin/main/profile/settings/components/Info';
import Password from 'views/admin/main/profile/settings/components/Password';
import Profile from 'views/admin/main/profile/settings/components/Profile';
import Socials from 'views/admin/main/profile/settings/components/Socials';

export default function Settings() {
	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid mb='20px' columns={{ sm: 1, lg: 2 }} spacing={{ base: '20px', xl: '20px' }}>
				{/* Column Left */}
				<Flex direction='column'>
					<Profile name='Vlad Mihalache' avatar={profile} banner={banner} />
					<Info />
				</Flex>
				{/* Column Right */}
				<Flex direction='column'>
					<Socials />
					<Password />
				</Flex>
			</SimpleGrid>
		</Box>
	);
}
