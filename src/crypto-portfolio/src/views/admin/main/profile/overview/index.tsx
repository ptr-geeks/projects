/*!
""

*/
import { useState } from "react";

// Chakra imports
import { Box, Button, Center, Grid, Link, Spinner, Text, useColorModeValue, useToast } from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/main/profile/overview/components/Banner';
import General from 'views/admin/main/profile/overview/components/General';
import Notifications from 'views/admin/main/profile/overview/components/Notifications';
import Projects from 'views/admin/main/profile/overview/components/Projects';
import Storage from 'views/admin/main/profile/overview/components/Storage';
import Upload from 'views/admin/main/profile/overview/components/Upload';
import Card from 'components/card/Card';

// Assets
import banner from 'assets/img/auth/banner.png';
import avatar from 'assets/img/avatars/avatar4.png';
import { useUser } from 'contexts/UserContext';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { links } from 'helpers/links';
import { calendarData } from 'views/admin/main/applications/calendar/variables/calendar';
import EventCalendar from 'components/calendar/EventCalendar';
import Timeline from 'views/admin/main/applications/calendar/components/Timeline';
import { getToast } from "helpers/formatters";
import Transactions from "./components/Transactions";
import AddressBundles from "./components/AddressBundles";


export default function Overview() {
	const textColor = useColorModeValue('secondaryGray.900', 'white');

	const { user } = useUser();
	const history = useHistory();
	const toast = useToast();

	const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	const getUserCreationTime = () => {
		const d = new Date(user?.metadata?.creationTime);
		if(d) {
			const m = months[d.getMonth()];
			const y = d.getFullYear();
			return `${m} ${y}`;
		}else{
			return "-";
		}
	}

	useEffect(() => {
		if(!user) {
			toast(getToast("info", "Sign in first!", "You must be signed in first."));
			history.push(`${links.signIn}?to=${links.profileOverview}`);
		}
	}, [user]);

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			{/* Main Fields */}
			<Banner
				gridArea='1 / 1 / 2 / 2'
				banner={banner}
				avatar={avatar}
				name={user?.email}
				job={user?.displayName}
				events={"0"}
				created={"0"}
				joined={getUserCreationTime()}
			/>
			{/*<Grid
				templateColumns={{
					base: '1fr',
					lg: '1.34fr 1fr 1.62fr'
				}}
				templateRows={{
					base: 'repeat(3, 1fr)',
					lg: '1fr'
				}}
				gap={{ base: '20px', xl: '20px' }}>
				{/*<Banner
					gridArea='1 / 1 / 2 / 2'
					banner={banner}
					avatar={avatar}
					name={user.email}
					job={user.displayName}
					posts='17'
					followers='9.7k'
					following='274'
			/>*/}
				{/*<Storage /*gridArea={{ base: '2 / 1 / 3 / 2', lg: '1 / 2 / 2 / 3' }} used={25.6} total={50} />
				<Upload
					/*gridArea={{
						base: '3 / 1 / 4 / 2',
						lg: '1 / 3 / 2 / 4'
					}}
					minH={{ base: 'auto', lg: '420px', '2xl': '365px' }}
					pe='20px'
					pb={{ base: '100px', lg: '20px' }}
				/>}
			</Grid>*/}
			<Grid
				mb='20px'
				templateColumns={{
					base: '1fr',
					lg: 'repeat(2, 1fr)',
					'2xl': '1.25fr 1.25fr 0.9fr'
				}}
				templateRows={{
					base: '1fr',
					lg: 'repeat(2, 1fr)',
					'2xl': '1fr'
				}}
				gap={{ base: '20px', xl: '20px' }}>
				<Projects />
				<Transactions />
				{/*<General gridArea={{ base: '2 / 1 / 3 / 2', lg: '1 / 2 / 2 / 3' }} minH='365px' pe='20px' />*/}
				<Notifications
					used={25.6}
					total={50}
					gridArea={{
						base: '3 / 1 / 4 / 2',
						lg: '2 / 1 / 3 / 3',
						'2xl': '1 / 3 / 2 / 4'
					}}
				/>
			</Grid>
			<AddressBundles />
		</Box>
	);
}
