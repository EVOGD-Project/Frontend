'use client';

import { Box, Button, Container, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiBookOpen } from 'react-icons/fi';
import ClassroomCard from '../general/ClassroomCard';
import { classrooms } from '../mocks/classrooms';

export default function IndexScreen() {
	const router = useRouter();

	return (
		<Box as='main' className='animate-fade-in'>
			<Box bg='brand.dark.900' py={20} position='relative' overflow='hidden'>
				<Box
					position='absolute'
					top={0}
					left={0}
					right={0}
					bottom={0}
					bgGradient='radial(circle at 50% 50%, brand.primary.500 0%, transparent 80%)'
					opacity={0.15}
				/>

				<Container maxW='container.xl'>
					<Flex direction='column' align='center' textAlign='center' gap={6}>
						<Heading
							as='h1'
							size='2xl'
							bgGradient='linear(to-r, white, brand.primary.400)'
							bgClip='text'
							letterSpacing='tight'
							mb={4}
						>
							El mejor reemplazo de EVAGD.
						</Heading>
						<Text fontSize='xl' maxW='container.md' mb={8}>
							¿EVAGD va lento? ¿Está caido? ¿No funciona? Únete a <b>EVOGD</b>, la revolución.
						</Text>
						<Flex gap={4}>
							<Button
								size='lg'
								colorScheme='blue'
								onMouseEnter={() => router.prefetch('/classes')}
								onClick={() => router.push('/classes')}
							>
								Comenzar Ahora
							</Button>
							<Button
								size='lg'
								variant='outline'
								onMouseEnter={() => router.prefetch('/classes')}
								onClick={() => router.push('/classes')}
							>
								Explorar Clases
							</Button>
						</Flex>
					</Flex>
				</Container>
			</Box>

			<Box py={16} bg='brand.dark.950'>
				<Container maxW='container.xl'>
					<Box mb={16}>
						<Flex justify='space-between' align='center' mb={8}>
							<Heading size='lg'>Clases Destacadas</Heading>
							<Button
								variant='ghost'
								rightIcon={<FiBookOpen />}
								onMouseEnter={() => router.prefetch('/classes')}
								onClick={() => router.push('/classes')}
							>
								Todas las clases
							</Button>
						</Flex>
						<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, lg: 6 }}>
							{classrooms.slice(0, 4).map((c) => (
								<ClassroomCard item={c} key={c.id} />
							))}
						</SimpleGrid>
					</Box>
				</Container>
			</Box>
		</Box>
	);
}
