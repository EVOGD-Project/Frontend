'use client';

import { classroomsAtom } from '@/store/classrooms';
import {
	Box,
	Button,
	Container,
	Flex,
	Grid,
	Heading,
	SimpleGrid,
	Spinner,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import {} from 'react';
import { FiPlus, FiUsers } from 'react-icons/fi';
import ClassroomCard from '../general/ClassroomCard';
import CreateClassModal from '../modals/CreateClassModal';
import JoinClassModal from '../modals/JoinClassModal';

export default function ClassroomsScreen() {
	const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
	const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();
	const [classrooms] = useAtom(classroomsAtom);

	return (
		<Box as='main' className='animate-fade-in'>
			<Box bg='brand.dark.900' py={12}>
				<Container maxW='container.xl'>
					<Grid
						templateColumns={{ base: '1fr', md: 'auto 1fr auto' }}
						gap={{ base: 6, md: 12 }}
						alignItems='center'
					>
						<Flex direction='column' gap={6}>
							<Heading size='xl'>Mis Clases</Heading>
							<Text fontSize='lg' color='gray.400'>
								Todas mis clases o las clases en las que estoy matriculado.
							</Text>
						</Flex>

						<Flex gap={4} justify={{ base: 'start', md: 'end' }}>
							<Button leftIcon={<FiPlus />} colorScheme='blue' onClick={onCreateOpen}>
								Crear Clase
							</Button>
							<Button leftIcon={<FiUsers />} variant='outline' onClick={onJoinOpen}>
								Unirse a Clase
							</Button>
						</Flex>
					</Grid>
				</Container>
			</Box>

			<Container maxW='container.xl' py={8}>
				{classrooms === null ? (
					<Flex h='200px' align='center' justify='center'>
						<Spinner size='xl' borderWidth='4px' />
					</Flex>
				) : classrooms.length > 0 ? (
					<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
						{classrooms.map((classroom) => (
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
							Aún no tienes clases
						</Text>
						<Button leftIcon={<FiPlus />} variant='outline' onClick={onCreateOpen}>
							Crear tu primera clase
						</Button>
					</Flex>
				)}
			</Container>
			<CreateClassModal isOpen={isCreateOpen} onClose={onCreateClose} />
			<JoinClassModal isOpen={isJoinOpen} onClose={onJoinClose} />
		</Box>
	);
}
