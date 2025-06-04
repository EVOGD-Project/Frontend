'use client';

import { Button, Flex, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
	const router = useRouter();
	return (
		<Flex
			w='100%'
			py='20px'
			gap='10px'
			bg='#1D1D1DFF'
			direction='row'
			px={['15px', '40px', '80px']}
			zIndex={250}
			alignItems='center'
		>
			<Flex w='100%' direction='column' gap='10px'>
				<Flex
					as={Button}
					w='fit-content'
					variant='unstyled'
					gap='10px'
					cursor='pointer'
					textAlign='center'
					alignItems='center'
					tabIndex={0}
				>
					<Heading size='md' color='#CAE3FFFF'>
						EVOGD
					</Heading>
				</Flex>
			</Flex>
			<Flex gap='10px' alignItems='end' direction='column'>
				<Button color='#CAE3FFFF' onMouseEnter={() => router.prefetch('/')} onClick={() => router.push('/')}>
					Home
				</Button>
			</Flex>
		</Flex>
	);
}
