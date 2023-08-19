// Chakra imports
import { Avatar, Box, Button, Flex, Icon, IconButton, Link, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useUser } from 'contexts/UserContext';
import { links } from 'helpers/links';
import { BiLogOut } from 'react-icons/bi';
import { MdEdit, MdEmail, MdPassword, MdVerified, MdVerifiedUser } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

export default function Banner(props: {
	banner: string;
	avatar: string;
	name: string;
	job: string;
	events: string;
	created: string;
	joined: string;
	[x: string]: any;
}) {
	const { banner, avatar, name, job, joined, events, created, ...rest } = props;
	// Chakra Color Mode
	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = 'gray.400';
	const borderColor = useColorModeValue('white !important', '#111C44 !important');

	const { signOut, user } = useUser();

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

	return (
		<Card mb={{ base: '0px', lg: '20px' }} alignItems='center' {...rest}>
			<Box bg={`url(${banner})`} bgSize='cover' borderRadius='16px' h='131px' w='100%' />
			<Avatar mx='auto' src={avatar} h='87px' w='87px' mt='-43px' border='4px solid' borderColor={borderColor} />
			<Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
				{name}
			</Text>
			<Text color={textColorSecondary} fontSize='sm'>
				{job}
			</Text>
			<Flex flexDirection={"row"} my="12px">
				{/*<Link href={`/#${links.profileSettings}`} variant='no-hover' mx='auto' p='0px !important'>
					<Button>
						<Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px' mr="10px" />
						Edit
					</Button>
	</Link>*/}
				<Button mx="auto" onClick={handleSignOut}>
					<Icon as={BiLogOut} color='secondaryGray.500' h='18px' w='18px' mr="10px" />
					Sign Out
				</Button>
				<Link href={`/#${links.updatePassword}?to=${links.profileOverview}`} variant='no-hover' mx='auto' p='0px !important'>
					<Button>
						<Icon as={MdPassword} color='secondaryGray.500' h='18px' w='18px' mr="10px" />
						Change Password
					</Button>
				</Link>
				{!user?.emailVerified && user?.email ? (
					<Link href={`/#${links.verifyEmail}?to=${links.profileOverview}`} variant='no-hover' mx='auto' p='0px !important'>
						<Button>
							<Icon as={MdVerifiedUser} color='secondaryGray.500' h='18px' w='18px' mr="10px" />
							Verify Email
						</Button>
					</Link>
				):null}
				{!user?.displayName ? (
					<Link href={`/#${links.setAddress}?to=${links.profileOverview}`} variant='no-hover' mx='auto' p='0px !important'>
						<Button>
							<Icon as={MdEmail} color='secondaryGray.500' h='18px' w='18px' mr="10px" />
							Set Address
						</Button>
					</Link>
				):null}
			</Flex>
			<Flex w='max-content' mx='auto'>
				<Flex mx='auto' me='60px' align='center' direction='column'>
					<Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
						{created}
					</Text>
					<Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
						Created
					</Text>
				</Flex>
				<Flex mx='auto' me='60px' align='center' direction='column'>
					<Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
						{events}
					</Text>
					<Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
						Events
					</Text>
				</Flex>
				<Flex mx='auto' align='center' direction='column'>
					<Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
						{joined}
					</Text>
					<Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
						Joined
					</Text>
				</Flex>
			</Flex>
		</Card>
	);
}
