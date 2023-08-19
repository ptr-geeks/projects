import { useState, useEffect } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, useColorModeValue, Text, useToast, InputGroup, Icon, InputRightElement } from '@chakra-ui/react';

// Custom components
import DefaultAuth from 'layouts/auth/variants/Default';

// Assets
import illustration from 'assets/img/auth/auth.png';
import { useHistory } from "react-router-dom";
import { useUser } from "contexts/UserContext";
import { getToast, useQuery } from "helpers/formatters";
import { links } from "helpers/links";
import { RiEyeCloseLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";

function UpdatePassword() {
	// Chakra color mode
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const brandStars = useColorModeValue('brand.500', 'brand.400');

	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const [password, setPassword] = useState<string>("");

	const { user, changePassword, signOut } = useUser();
	const history = useHistory();
	const toast = useToast();
	const query = useQuery();

	const redirectAfterError = () => {
		const to = query.get("to");
		const redirectTo = to ? `${links.signIn}?to=${links.updatePassword}_to=${to}` : `${links.signIn}?to=${links.updatePassword}`;
		history.push(redirectTo);
	}

	const handleUpdatePassword = async() => {
		try{
			if(password) {
				await changePassword(password);
				const to = query.get("to");
				const redirectTo = (to || links.profileOverview).replace("_", "?").replaceAll("_", "&");
				history.push(redirectTo);
			}
		}catch(err){
			await signOut();
			toast(getToast("error", "ERROR!", "You need to be logged in recently to be able to change your password!"));
			redirectAfterError();
		}
	}

	useEffect(() => {
		if(!user) {
			toast(getToast("info", "Must be signed in!", "Sign in first, redirecting you to sign in page."))
			redirectAfterError();
		}
	}, [user]);

	return (
		<DefaultAuth illustrationBackground={illustration} image={illustration}>
			<Flex
				w='100%'
				maxW='max-content'
				mx={{ base: 'auto', lg: '0px' }}
				me='auto'
				h='100%'
				alignItems='start'
				justifyContent='center'
				mb={{ base: '30px', md: '60px', lg: '100px', xl: '60px' }}
				px={{ base: '25px', md: '0px' }}
				mt={{ base: '40px', lg: '16vh', xl: '22vh' }}
				flexDirection='column'>
				<Box me='auto' mb='34px'>
					<Heading color={textColor} fontSize={{ base: '3xl', md: '36px' }} mb='16px'>
						Forgot your password?
					</Heading>
					<Text color={textColorSecondary} fontSize='md' w={{ base: '100%', lg: '456px' }} maxW='100%'>
						No problem. Just let us know your email address and we'll email you a password reset link that
						will allow you to choose a new one.
					</Text>
				</Box>
				<Flex
					zIndex='2'
					direction='column'
					w={{ base: '100%', lg: '456px' }}
					maxW='100%'
					background='transparent'
					borderRadius='15px'
					mx={{ base: 'auto', lg: 'unset' }}
					me='auto'
					mb={{ base: '20px', md: 'auto' }}
					align='start'>
					<FormControl>
					<FormLabel ms='4px' fontSize='sm' fontWeight='500' color={textColor} display='flex'>
							Password<Text color={brandStars}>*</Text>
						</FormLabel>
						<InputGroup size='md'>
							<Input
								isRequired={true}
								fontSize='sm'
								ms={{ base: '0px', md: '4px' }}
								placeholder='Min. 8 characters'
								mb='24px'
								size='lg'
								type={show ? 'text' : 'password'}
								variant='auth'
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							<InputRightElement display='flex' alignItems='center' mt='4px'>
								<Icon
									color={textColorSecondary}
									_hover={{ cursor: 'pointer' }}
									as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
									onClick={handleClick}
								/>
							</InputRightElement>
						</InputGroup>
						<Button fontSize='sm' variant='brand' fontWeight='500' w='100%' h='50' mb='24px' onClick={handleUpdatePassword}>
							Update Password
						</Button>
					</FormControl>
				</Flex>
			</Flex>
		</DefaultAuth>
	);
}

export default UpdatePassword;
