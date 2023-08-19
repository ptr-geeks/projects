import { useState, useEffect } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, useColorModeValue, Text, useToast, Link, Center, Spinner } from '@chakra-ui/react';

// Custom components
import DefaultAuth from 'layouts/auth/variants/Default';

// Assets
import illustration from 'assets/img/auth/auth.png';
import { useHistory } from "react-router-dom";
import { useUser } from "contexts/UserContext";
import { getToast, useQuery } from "helpers/formatters";
import { links } from "helpers/links";
import Loading from "components/Loading/Loading";

function VerifyEmail() {
	// Chakra color mode
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const brandStars = useColorModeValue('brand.500', 'brand.400');

	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const [password, setPassword] = useState<string>("");

	const { user, signOut, verifyEmail, getIsVerified } = useUser();
	const history = useHistory();
	const toast = useToast();
	const query = useQuery();

	const [isLoading, setLoading] = useState<boolean>(false);

	const redirectAfterVerified = () => {
		const to = query.get("to");
		const redirectTo = (to || links.profileOverview).replace("_", "?").replaceAll("_", "&");
		console.log(redirectTo);
		history.push(redirectTo);
	}

	const handleVerify = async() => {
		try{
			if(!user?.emailVerified) {
				setLoading(true);
				await verifyEmail();
				let intervalId: any;
				intervalId = setInterval(() => {
					(async function get() {
						let _isVerified = await getIsVerified();
						console.log("is verified: ", _isVerified)
						if(_isVerified) {
							clearInterval(intervalId);
							setLoading(false);
							toast(getToast("success", "Verified!", "Your email has been verified successfully!"));
							redirectAfterVerified();
						};
					})();
				}, 1000);
			}
		}catch(err){
			await signOut();
			setLoading(false);
			toast(getToast("error", "ERROR!", "You need to be logged in recently to be able to change your password!"));
			const to = query.get("to");
			const redirectTo = to ? `${links.signIn}?to=${links.verifyEmail}_to=${to}` : `${links.signIn}?to=${links.verifyEmail}`;
			history.push(redirectTo);
		}
	}

	useEffect(() => {
		console.log(user);
		if(!user) {
			const to = query.get("to");
			toast(getToast("info", "Must be signed in!", "Sign in first, redirecting you to sign in page."));
			const redirectTo = to ? `${links.signIn}?to=${links.verifyEmail}_to=${to}` : `${links.signIn}?to=${links.verifyEmail}`;
			history.push(redirectTo);
		}else if(user?.emailVerified) {
			toast(getToast("info", "Already verified!", "Your email is already verified."));
			redirectAfterVerified();
		}
		if(user) {
			(async function get() {
				let _isVerified = await getIsVerified();
				if(_isVerified) {
					redirectAfterVerified();
				}
			})();
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
						Verify Email
					</Heading>
					<Text color={textColorSecondary} fontSize='md' w={{ base: '100%', lg: '456px' }} maxW='100%'>
						Verify your email to start receiving notifications about your subscriptions!
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
						{isLoading ? (
							<Loading text="Verifying ..."/>
						):(
							<Button disabled={isLoading} fontSize='sm' variant='brand' fontWeight='500' w='100%' h='50' mb='20px' onClick={handleVerify}>
								Send me a verification link
							</Button>
							)}
						<Text color={textColorSecondary} textAlign="center" pb="25px" fontSize='md' w={{ base: '100%', lg: '456px' }} maxW='100%'>
							When you get a verification link to <b>{user?.email}</b> follow the instructions there and then come back.
						</Text>
						<Link href={`/#${query.get("to") || links.home}`}>
							<Button disabled={isLoading} fontSize='sm' fontWeight='500' w='100%' h='50' mb='12px'>
								I'll do it later
							</Button>
						</Link>
					</FormControl>
				</Flex>
			</Flex>
		</DefaultAuth>
	);
}

export default VerifyEmail;
