
// Chakra imports
import { Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';

import SearchTableUsers from 'views/admin/main/users/overview/components/SearchTableUsersOverivew'; 
import tableDataUsersOverview from 'views/admin/main/users/overview/variables/tableDataUsersOverview';

export default function UsersOverview() {
	return (
		<Flex direction='column' pt={{ sm: '125px', lg: '75px' }}>
			<Card px='0px'>
				<SearchTableUsers tableData={tableDataUsersOverview}  />
			</Card>
		</Flex>
	);
}
