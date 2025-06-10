'use client';

import { classroomsAtom } from '@/store/classrooms';
import { Box, Button, Container, Flex, Heading, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { FiBookOpen } from 'react-icons/fi';
import ClassroomCard from '../general/ClassroomCard';

export default function IndexScreen() {
	const router = useRouter();
	const [classrooms] = useAtom(classroomsAtom);

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
							¿EVAGD va lento? ¿Está caído? ¿No funciona? Únete a <b>EVOGD</b>, la revolución.
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

			<Container maxW='container.xl' py={12}>
				<Box>
					<Heading size='lg' mb={6}>
						Clases Destacadas
					</Heading>
					{classrooms === null ? (
						<Flex h='200px' align='center' justify='center'>
							<Spinner size='xl' borderWidth='4px' />
						</Flex>
					) : classrooms.length > 0 ? (
						<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
							{classrooms.slice(0, 4).map((classroom) => (
								<ClassroomCard key={classroom.id} item={classroom} />
							))}
						</SimpleGrid>
					) : (
						<Flex
							direction='column'
							align='center'
							justify='center'
							py={16}
							gap={4}
							bg='brand.dark.900'
							borderRadius='xl'
							border='1px dashed'
							borderColor='brand.dark.700'
						>
							<Text fontSize='lg' color='gray.400'>
								No hay clases disponibles
							</Text>
							<Button leftIcon={<FiBookOpen />} variant='outline' onClick={() => router.push('/classes')}>
								Explorar Clases
							</Button>
						</Flex>
					)}
				</Box>
			</Container>
		</Box>
	);
}
