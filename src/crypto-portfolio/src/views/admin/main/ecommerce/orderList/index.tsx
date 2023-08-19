
// Chakra imports
import { Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';

import SearchTableOrders from 'views/admin/main/ecommerce/orderList/components/SearchTableOrders'; 
import tableDataOrders from 'views/admin/main/ecommerce/orderList/variable/tableDataOrders';

export default function SearchUser() {
	return (
		<Flex direction='column' pt={{ sm: '125px', lg: '75px' }}>
			<Card px='0px'>
				<SearchTableOrders tableData={tableDataOrders} />
			</Card>
		</Flex>
	);
}
