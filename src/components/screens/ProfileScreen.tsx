'use client';

import { api } from '@/api/api';
import { CDN_URL } from '@/constants/constants';
import { authAtom } from '@/store/auth';
import { classroomsAtom } from '@/store/classrooms';
import type { IClassroom } from '@/types/IClassroomCard';
import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	Grid,
	Heading,
	SimpleGrid,
	Spinner,
	Text,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { FiPlus, FiUsers } from 'react-icons/fi';
import ClassroomCard from '../general/ClassroomCard';
import CreateClassModal from '../modals/CreateClassModal';
import EditAccountModal from '../modals/EditAccountModal';

export default function ProfileScreen() {
	const [auth] = useAtom(authAtom);
	const [classrooms] = useAtom(classroomsAtom);
	const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
	const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

	const { user } = auth;

	if (typeof location !== 'undefined' && !user && !auth.isLoading) location.href = '/';

	return user ? (
		<Box as='main' className='animate-fade-in'>
			<Box bg='brand.dark.900' py={12}>
				<Container maxW='container.xl'>
					<Grid
						templateColumns={{ base: '1fr', md: 'auto 1fr auto' }}
						gap={{ base: 6, md: 12 }}
						alignItems='center'
					>
						<Flex align='center' gap={6}>
							<Avatar
								size='xl'
								name={user.username}
								src={user?.avatar ? `${CDN_URL}/avatars/${user.id}/${user.avatar}.png` : ''}
							/>
							<VStack align='start' spacing={1}>
								<Heading size='lg'>{user.username}</Heading>
								<Text color='gray.400'>{user.email}</Text>
							</VStack>
						</Flex>

						<Flex gap={4} justify={{ base: 'start', md: 'end' }}>
							<Button leftIcon={<FiPlus />} colorScheme='blue' onClick={onCreateOpen}>
								Crear Clase
							</Button>
							<Button leftIcon={<FiUsers />} variant='outline' onClick={onEditOpen}>
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
						{classrooms === null ? (
							<Flex h='200px' align='center' justify='center'>
								<Spinner size='lg' />
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
					</Box>
				</VStack>
			</Container>

			<CreateClassModal isOpen={isCreateOpen} onClose={onCreateClose} />
			<EditAccountModal isOpen={isEditOpen} onClose={onEditClose} />
		</Box>
	) : (
		<></>
	);
}
