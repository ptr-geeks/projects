import { useState } from "react";
import { Button, Flex, Select, Text, useColorModeValue } from '@chakra-ui/react';
import { BullFolio } from 'bullfolio-types';
import Card from 'components/card/Card';
import Loading from 'components/Loading/Loading';
import { useUser } from 'contexts/UserContext';


export default function Notifications(props: { [x: string]: any }) {
	const { ...rest } = props;
	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

	const { userData, setBaseCurrency } = useUser();

	const [currency, setCurrency] = useState<BullFolio.MainCurrencies>("usd");
	const [isLoading, setIsLoading] = useState(false);

	const currencies: BullFolio.MainCurrencies[] = ["usd", "eur", "jpy", "btc", "eth"];

	const handleSetCurrency = async () => {
		setIsLoading(true);
		await setBaseCurrency(currency);
		setIsLoading(false);
	}

	return (
		<Card mb='20px' {...rest}>
			<Flex align='center' w='100%' justify='space-between' mb='10px'>
				<Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mb='4px'>
					Settings
				</Text>
			</Flex>
			{!isLoading ? (
				<>
					<Text>
						Base Currency
					</Text>
					<Select value={userData?.baseCurrency} onChange={(e) => setCurrency(e.target.value as BullFolio.MainCurrencies)}>
						{currencies.map(x => {
							return(
								<option key={x} value={x}>{x.toUpperCase()}</option>
							)
						})}
					</Select>
					<Button width={"100%"} variant="brand" mt="4" onClick={handleSetCurrency}>
						Save Changes
					</Button>
				</>
			):(
				<Loading text='Wait...' />
			)}
			{/*<SwitchField
				isChecked={true}
				reversed={true}
				fontSize='sm'
				mb='20px'
				id='1'
				label='Item update notifications'
			/>
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='2' label='Item comment notifications' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='3' label='Buyer review notifications' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='4' label='Rating reminders notifications' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='5' label='Meetups near you notifications' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='6' label='Company news notifications' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='7' label='New launches and projects' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='8' label='Monthly product changes' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='9' label='Subscribe to newsletter' />
			<SwitchField reversed={true} fontSize='sm' mb='20px' id='10' label='Email me when someone follows me' />
			*/}
		</Card>
	);
}
