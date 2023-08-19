
// Chakra imports
import { Box, Grid, Icon, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';

// Assets
import { MdAttachMoney, MdCreditCard, MdPerson, MdRedo, MdShowChart } from 'react-icons/md';
import Earn from 'views/admin/main/ecommerce/referrals/components/Earn';
import Invite from 'views/admin/main/ecommerce/referrals/components/Invite';
import ReferralsTable from 'views/admin/main/ecommerce/referrals/components/ReferralsTable'; 
import tableDataReferrals from 'views/admin/main/ecommerce/referrals/variables/tableDataReferrals';

export default function Referrals() {
	// Chakra Color Mode
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Grid w='100%' mb='20px' gap='20px' templateColumns='2.1fr 1fr'>
				<Earn me='20px' gridArea={{ base: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }} />
				<Invite
					referralCode='BullFolio.com/referral=9421738401'
					fbLink='#'
					twtLink='#'
					gridArea={{ base: '2 / 1 / 3 / 3', '2xl': '1 / 2 / 2 / 3' }}
				/>
			</Grid>
			<SimpleGrid columns={{ base: 1, md: 2, xl: 5 }} gap='20px' mb='20px'>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />}
						/>
					}
					name='Your Earnings'
					value='$127,589'
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdShowChart} color={brandColor} />}
						/>
					}
					name='Your Profit'
					value='$67,325'
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdPerson} color={brandColor} />}
						/>
					}
					name='Customers'
					value='1,849'
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdCreditCard} color={brandColor} />}
						/>
					}
					name='Average Value'
					value='$69.00'
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdRedo} color={brandColor} />}
						/>
					}
					name='Refund Rate'
					value='5,70%'
				/>
			</SimpleGrid>
			<Card>
				<ReferralsTable tableData={tableDataReferrals}  />
			</Card>
		</Box>
	);
}
