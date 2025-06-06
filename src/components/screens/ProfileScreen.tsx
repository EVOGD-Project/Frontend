'use client';

import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	Grid,
	Heading,
	SimpleGrid,
	Text,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import { FiPlus, FiUsers } from 'react-icons/fi';
import { classrooms } from '../../mocks/classrooms';
import ClassroomCard from '../general/ClassroomCard';
import CreateClassModal from '../modals/CreateClassModal';

const mockUser = {
	name: 'Ángel',
	email: 'contacto@tnfangel.com',
	avatar: 'https://avatars.githubusercontent.com/u/57068341?v=4'
};

export default function ProfileScreen() {
	const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

	const myClasses = classrooms.slice(0, 4);

	return (
		<Box as='main' className='animate-fade-in'>
			<Box bg='brand.dark.900' py={12}>
				<Container maxW='container.xl'>
					<Grid
						templateColumns={{ base: '1fr', md: 'auto 1fr auto' }}
						gap={{ base: 6, md: 12 }}
						alignItems='center'
					>
						<Flex align='center' gap={6}>
							<Avatar size='xl' name={mockUser.name} src={mockUser.avatar} />
							<VStack align='start' spacing={1}>
								<Heading size='lg'>{mockUser.name}</Heading>
								<Text color='gray.400'>{mockUser.email}</Text>
							</VStack>
						</Flex>

						<Flex gap={4} justify={{ base: 'start', md: 'end' }}>
							<Button leftIcon={<FiPlus />} colorScheme='blue' onClick={onCreateOpen}>
								Crear Clase
							</Button>
							<Button leftIcon={<FiUsers />} variant='outline'>
								Editar cuenta
							</Button>
						</Flex>
					</Grid>
				</Container>
			</Box>

			<Container maxW='container.xl' py={8}>
				<VStack spacing={8} align='stretch'>
					<Box>
						<Heading size='lg' mb={6}>
							Clases Destacadas
						</Heading>
						{myClasses.length > 0 ? (
							<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
								{myClasses.map((classroom) => (
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
					</Box>
				</VStack>
			</Container>

			<CreateClassModal isOpen={isCreateOpen} onClose={onCreateClose} />
		</Box>
	);
}
