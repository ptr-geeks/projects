
// Chakra imports
import { Button, Box, Grid, SimpleGrid } from '@chakra-ui/react';
// Assets
import home from 'assets/img/dashboards/home.png';
// Custom components
import Card from 'components/card/Card';
import General from 'views/admin/dashboards/smartHome/components/General';
import Light from 'views/admin/dashboards/smartHome/components/Light';
import MapCard from 'views/admin/dashboards/smartHome/components/MapCard';
import Plan from 'views/admin/dashboards/smartHome/components/Plan';
import Temperature from 'views/admin/dashboards/smartHome/components/Temperature';
import Weather from 'views/admin/dashboards/smartHome/components/Weather';
import Consumption from 'views/admin/dashboards/smartHome/components/Consumption';
import AddDevice from 'views/admin/dashboards/smartHome/components/AddDevice';

export default function SmartHome() {
	// Chakra Color Mode
	return (
		<Grid
			pt={{ base: '130px', md: '80px', xl: '80px' }}
			mb='20px'
			gridTemplateColumns='2.6fr 1fr'
			gap={{ base: '20px', xl: '20px' }}
			display={{ base: 'block', lg: 'grid' }}>
			<Box gridArea='1 / 1 / 2 / 2'>
				<SimpleGrid columns={{ base: 1, md: 2, '2xl': 3 }} gap='20px' mb='20px'>
					<Card bgSize='cover' w='' minH={{ base: '310px', md: '100%' }} bgImage={home}>
						<Button
							variant='no-hover'
							w='max-content'
							backdropFilter='blur(11px)'
							borderRadius='70px'
							mt='auto'
							fontSize='sm'
							bg='linear-gradient(112.83deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0) 110.84%)'
							color='white'
							fontWeight='bold'>
							More photos
						</Button>
					</Card>
					<Temperature />
					<Weather />
					<Plan />
					<Light />
					<General />
				</SimpleGrid>
				<Grid
					mb='20px'
					gridTemplateColumns={{ base: '1fr 1fr', xl: '2fr 1fr' }}
					gap={{ base: '20px', xl: '20px' }}
					display={{ base: 'block', lg: 'grid' }}>
					<Consumption />
					<AddDevice />
				</Grid>
			</Box>

			<MapCard gridArea='1 / 2 / 2 / 3' />
		</Grid>
	);
}
