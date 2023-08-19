/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* BullFolio - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 BullFolio (https://www.horizon-ui.com/)

* Designed and Coded by BullFolio

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid } from '@chakra-ui/react';
import DevelopmentTable from 'views/admin/main/applications/dataTables/components/DevelopmentTable';
import CheckTable from 'views/admin/main/applications/dataTables/components/CheckTable';
import ColumnsTable from 'views/admin/main/applications/dataTables/components/ColumnsTable';
import ComplexTable from 'views/admin/main/applications/dataTables/components/ComplexTable';
import tableDataDevelopment from 'views/admin/main/applications/dataTables/variables/tableDataDevelopment';
import tableDataCheck from 'views/admin/main/applications/dataTables/variables/tableDataCheck';
import tableDataColumns from 'views/admin/main/applications/dataTables/variables/tableDataColumns';
import tableDataComplex from 'views/admin/main/applications/dataTables/variables/tableDataComplex';

export default function Settings() {
	// Chakra Color Mode
	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid mb='20px' columns={{ sm: 1, md: 2 }} spacing={{ base: '20px', xl: '20px' }}>
				<DevelopmentTable tableData={tableDataDevelopment} />
				<CheckTable tableData={tableDataCheck} />
				<ColumnsTable tableData={tableDataColumns} />
				<ComplexTable tableData={tableDataComplex} />
			</SimpleGrid>
		</Box>
	);
}
