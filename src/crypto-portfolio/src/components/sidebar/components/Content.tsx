// chakra imports
import { Avatar, Box, Button, Flex, Icon, Link, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import avatar4 from 'assets/img/avatars/avatar4.png';
import { useUser } from 'contexts/UserContext';
import { getToast } from 'helpers/formatters';
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useHistory, useLocation } from 'react-router-dom';
import { links } from 'helpers/links';
import Links from "./Links";
import IconBox from 'components/icons/IconBox';
import { MdSettings } from 'react-icons/md';


function SidebarContent(props: { routes: RoutesType[] }) {
	const { routes } = props;
	const textColor = useColorModeValue('navy.700', 'white');
	const { signOut, user } = useUser();
	const history = useHistory();
	const location = useLocation();

	const handleSignOut = async() => {
		try{
			if(user){
				await signOut();
			}
		}catch(err){
			const error: any = err;
			console.log(error)
		}
	}

	// SIDEBAR
	return (
		<Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
			<Brand />
			<Stack direction='column' mb='auto' mt='8px'>
				<Box ps='20px' pe={{ md: '16px', '2xl': '1px' }}>
					<Links routes={routes} />
				</Box>
			</Stack>

			{/*<Box ps='20px' pe={{ md: '16px', '2xl': '0px' }} mt='60px' borderRadius='30px'>
				<SidebarCard />
	</Box>*/}
			<Box mt='50px'>
				{user ? (
					<>
						<Flex mb="30px" justifyContent='center' alignItems='center' cursor={"pointer"}>
							<IconBox h='48px' w='48px' icon={<MdSettings fontSize={"xl"} />} me='20px'  onClick={() => history.push(links.profileSettings)} />
							<Box onClick={() => history.push(links.profileOverview)}>
								<Text color={textColor} fontSize='md' fontWeight='700'>
									{user.email}
								</Text>
								{/*<Text color='secondaryGray.600' fontSize='sm' fontWeight='400'>
									{getEllipsisTxt(user.displayName)}
								</Text>*/}
							</Box>
						</Flex>
						<Flex pb="8" justifyContent={"center"} alignItems="center">
							<Button variant={"brand"} w="80%" mx="auto" onClick={handleSignOut}>
								<BiLogOut style={{ marginRight: "10px" }} />
								Sign Out
							</Button>
						</Flex>
					</>
				):(					
					<Flex pb="8" justifyContent={"center"} alignItems="center">
						{/*<Link href={`/#${links.signInCentered}?to=${location.pathname}`}>*/}
						<Button variant={"brand"} w="80%" mx="auto" onClick={() => history.push(links.signIn)}>
							<BiLogIn style={{ marginRight: "10px" }} />
							Sign in
						</Button>
					</Flex>
				)}
			</Box>
		</Flex>
	);
}

export default SidebarContent;
