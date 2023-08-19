import { useState, useEffect } from "react";
// Chakra imports
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Text,
	useColorModeValue
} from '@chakra-ui/react';
// Assets
import illustration from 'assets/img/auth/auth.png';
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/variants/Default';
import { NavLink, useHistory } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useUser } from "contexts/UserContext";
import { useQuery } from "helpers/formatters";
import { links } from "helpers/links";

function SignUp() {
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
	const textColorBrand = useColorModeValue('brand.500', 'white');
	const brandStars = useColorModeValue('brand.500', 'brand.400');
	const googleBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');
	const googleText = useColorModeValue('navy.700', 'white');
	const googleHover = useColorModeValue({ bg: 'gray.200' }, { bg: 'whiteAlpha.300' });
	const googleActive = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.200' });

	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const [password, setPassword] = useState<string>("");
	const [email, setEmail] = useState<string>("");

	const { user, signUpWithPassword } = useUser();
	const history = useHistory();
	const query = useQuery();

	const handleSignUp = async() => {
		try{
			if(email && password) {
				await signUpWithPassword(email, password);
			}else{
				throw new Error("Input your email and password!");
			}
		}catch(err){
			const error: any = err;
			console.log(error)
		}
	}

	useEffect(() => {
		if(user) {
			const redirectTo = (query.get("to") || links.home).replace("_", "?").replaceAll("_", "&");
			history.push(redirectTo);
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
				justifyContent='center'
				mb={{ base: '30px', md: '60px' }}
				px={{ base: '25px', md: '0px' }}
				mt={{ base: '40px', md: '8vh' }}
				flexDirection='column'>
				<Box me='auto'>
					<Heading color={textColor} fontSize={{ base: '34px', lg: '36px' }} mb='10px'>
						Sign Up
					</Heading>
					<Text mb='36px' ms='4px' color={textColorSecondary} fontWeight='400' fontSize='md'>
						Enter your email and password to sign up!
					</Text>
				</Box>
				<Flex
					zIndex='2'
					direction='column'
					w={{ base: '100%', md: '420px' }}
					maxW='100%'
					background='transparent'
					borderRadius='15px'
					mx={{ base: 'auto', lg: 'unset' }}
					me='auto'
					mb={{ base: '20px', md: 'auto' }}>
					<Button
						fontSize='sm'
						me='0px'
						mb='26px'
						py='15px'
						h='50px'
						borderRadius='16px'
						bg={googleBg}
						color={googleText}
						fontWeight='500'
						_hover={googleHover}
						_active={googleActive}
						_focus={googleActive}>
						<Icon as={FcGoogle} w='20px' h='20px' me='10px' />
						Sign up with Google
					</Button>
					<Flex align='center' mb='25px'>
						<HSeparator />
						<Text color={textColorSecondary} mx='14px'>
							or
						</Text>
						<HSeparator />
					</Flex>
					<FormControl>
						{/*<SimpleGrid columns={{ base: 1, md: 2 }} gap={{ sm: '10px', md: '26px' }}>
							<Flex direction='column'>
								<FormLabel
									display='flex'
									ms='4px'
									fontSize='sm'
									fontWeight='500'
									color={textColor}
									mb='8px'>
									First name<Text color={brandStars}>*</Text>
								</FormLabel>
								<Input
									isRequired={true}
									fontSize='sm'
									ms={{ base: '0px', md: '4px' }}
									placeholder='First name'
									variant='auth'
									mb='24px'
									size='lg'
								/>
							</Flex>
							<Flex direction='column'>
								<FormLabel
									display='flex'
									ms='4px'
									fontSize='sm'
									fontWeight='500'
									color={textColor}
									mb='8px'>
									Last name<Text color={brandStars}>*</Text>
								</FormLabel>
								<Input
									isRequired={true}
									variant='auth'
									fontSize='sm'
									placeholder='Last name'
									mb='24px'
									size='lg'
								/>
							</Flex>
						</SimpleGrid>*/}
						<FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' color={textColor} mb='8px'>
							Email<Text color={brandStars}>*</Text>
						</FormLabel>
						<Input
							isRequired={true}
							variant='auth'
							fontSize='sm'
							type='email'
							placeholder='mail@BullFolio.com'
							mb='24px'
							size='lg'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<FormLabel ms='4px' fontSize='sm' fontWeight='500' color={textColor} display='flex'>
							Password<Text color={brandStars}>*</Text>
						</FormLabel>
						<InputGroup size='md'>
							<Input
								isRequired={true}
								variant='auth'
								fontSize='sm'
								ms={{ base: '0px', md: '4px' }}
								placeholder='Min. 8 characters'
								mb='24px'
								size='lg'
								type={show ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
						<Flex justifyContent='space-between' align='center' mb='24px'>
							<FormControl display='flex' alignItems='start'>
								<Checkbox id='remember-login' colorScheme='brandScheme' me='10px' mt='3px' />
								<FormLabel
									htmlFor='remember-login'
									mb='0'
									fontWeight='normal'
									color={textColor}
									fontSize='sm'>
									By creating an account means you agree to the{' '}
									<Link href='https://BullFolio.com/terms-of-service' fontWeight='500'>
										Terms and Conditions,
									</Link>{' '}
									and our{' '}
									<Link href='https://BullFolio.com/privacy-policy' fontWeight='500'>
										Privacy Policy
									</Link>
								</FormLabel>
							</FormControl>
						</Flex>
						<Button variant='brand' fontSize='14px' fontWeight='500' w='100%' h='50' mb='24px' onClick={handleSignUp}>
							Create my account
						</Button>
					</FormControl>
					<Flex flexDirection='column' justifyContent='center' alignItems='start' maxW='100%' mt='0px'>
						<Text color={textColorDetails} fontWeight='400' fontSize='sm'>
							Already a member?
							<NavLink to={links.signIn}>
								<Text color={textColorBrand} as='span' ms='5px' fontWeight='500'>
									Sign in
								</Text>
							</NavLink>
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</DefaultAuth>
	);
}

export default SignUp;
