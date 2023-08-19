
// Chakra imports
import { Flex, SimpleGrid } from '@chakra-ui/react';
// Custom components
import YourCard from 'views/admin/main/account/billing/components/YourCard';
import YourTransactions from 'views/admin/main/account/billing/components/YourTransactions';
import YourTransfers from 'views/admin/main/account/billing/components/YourTransfers';
import Invoices from 'views/admin/main/account/billing/components/Invoices';
import Balance from 'views/admin/main/account/billing/components/Balance';
import Market from 'views/admin/main/account/billing/components/Market';
import PaymentMethod from 'views/admin/main/account/billing/components/PaymentMethod';
export default function Billing() {
	// Chakra Color Mode
	return (
		<Flex pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Flex direction='column' width='stretch'>
				<SimpleGrid columns={{ sm: 1, md: 1, lg: 1, xl: 3 }} gap='20px' mb='20px'>
					<Flex>
						<YourCard />
					</Flex>
					<Flex direction='column'>
						<Balance mb='20px' />
						<PaymentMethod />
					</Flex>
					<Flex>
						<Invoices />
					</Flex>
				</SimpleGrid>
				<SimpleGrid columns={{ sm: 1, md: 1, lg: 1, xl: 3 }} gap='20px' mb='20px'>
					<Flex>
						<YourTransactions />
					</Flex>
					<Flex>
						<Market />
					</Flex>
					<Flex>
						<YourTransfers />
					</Flex>
				</SimpleGrid>
			</Flex>
		</Flex>
	);
}
