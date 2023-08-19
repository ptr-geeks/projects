/* eslint-disable */ 

import { Box, Flex, Button, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';
import { MdOutlineCalendarToday } from 'react-icons/md';
// Custom components
import Card from 'components/card/Card'; 
import * as React from 'react';
// Assets

export type RowObjAddresses = {
	address: string;
  ens: string;
	chains: string[];
	totalValue: string;
	transactions: number;
	tokens: number;
  nfts: number;
};

const columnHelper = createColumnHelper<RowObjAddresses>();

// const columns = columnsDataCheck;
export default function AddressesOverview(props: { tableData: RowObjAddresses[] }) {
	const { tableData } = props;
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white'); 
	const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const columns = [
		columnHelper.accessor('address', {
			id: 'address',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					ADDRESS
				</Text>
			),
			cell: (info: any) => (
				<Text color={textColor} fontSize='sm' fontWeight='600'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('ens', {
			id: 'ens',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					ENS DOMAIN
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='600'>
					{info.getValue()}
				</Text> 
			)
		}),
		columnHelper.accessor('chains', {
			id: 'chains',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					ACTIVE CHAINS
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('totalValue', {
			id: 'totalValue',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					VALUE
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('transactions', {
			id: 'transactions',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					TRANSACTIONS
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
    columnHelper.accessor('tokens', {
			id: 'tokens',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					TOKENS
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
    columnHelper.accessor('nfts', {
			id: 'nfts',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					NFTs
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
	];

  const table = useReactTable({
		data: tableData,
		columns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true
	});
	return (
		<Card flexDirection='column' w='100%' px='0px' overflowX={"scroll"}>
			<Flex align='center' justify='space-between' w='100%' px='4' mb='20px'>
        <Text color={textColor} fontSize='lg' fontWeight='700' lineHeight='100%'>
          Addresses
        </Text>
      </Flex>
			<Box>
				<Table variant='simple' color='gray.500' mt="12px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<Th
											key={header.id}
											colSpan={header.colSpan}
											pe='10px'
											borderColor={borderColor}
											cursor='pointer'
											onClick={header.column.getToggleSortingHandler()}>
											<Flex
												justifyContent='space-between'
												align='center'
												fontSize={{ sm: '10px', lg: '12px' }}
												color='gray.400'>
												{flexRender(header.column.columnDef.header, header.getContext())}{{
													asc: '',
													desc: '',
												}[header.column.getIsSorted() as string] ?? null}
											</Flex>
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.slice(0, 11).map((row) => {
							return (
								<Tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td
												key={cell.id}
												fontSize={{ sm: '14px' }}
												minW={{ sm: '150px', md: '200px', lg: 'auto' }}
												borderColor='transparent'>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Box>
		</Card>
	);
} 