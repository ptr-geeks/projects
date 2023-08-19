// Chakra imports
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, useColorModeValue, Text } from '@chakra-ui/react';

// Custom components
import CenteredAuth from 'layouts/auth/variants/Centered';

function ForgotPassword() {
	// Chakra color mode
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const brandStars = useColorModeValue('brand.500', 'brand.400');
	return (
		<CenteredAuth
			image={'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)'}
			cardTop={{ base: '140px', md: '24vh' }}
			cardBottom={{ base: '50px', lg: 'auto' }}>
			<Flex
				w='100%'
				maxW='max-content'
				me='auto'
				h='100%'
				alignItems='start'
				justifyContent='center'
				px={{ base: '25px', md: '0px' }}
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
						/>
						<Button fontSize='sm' variant='brand' fontWeight='500' w='100%' h='50' mb='24px'>
							Email password reset link
						</Button>
					</FormControl>
				</Flex>
			</Flex>
		</CenteredAuth>
	);
}

export default ForgotPassword;
