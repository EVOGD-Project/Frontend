'use client';

import {
	Box,
	Container,
	Flex,
	Heading,
	SimpleGrid,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import ClassroomCard from '../general/ClassroomCard';
import { classrooms } from '../mocks/classrooms';
import CreateClassModal from '../modals/CreateClassModal';
import JoinClassModal from '../modals/JoinClassModal';

export default function ClassesScreen() {
	const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
	const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();

	return (
		<Box as='main' className='animate-fade-in'>
			<Box bg='brand.dark.900' py={12}>
				<Container maxW='container.xl'>
					<Flex direction='column' gap={6}>
						<Heading size='xl'>Mis Clases</Heading>
						<Text fontSize='lg' color='gray.400'>
							Todas mis clases o las clases en las que estoy matriculado.
						</Text>
					</Flex>
				</Container>
			</Box>

			<Container maxW='container.xl' py={8}>
				<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
					{classrooms.map((classroom) => (
						<ClassroomCard key={classroom.id} item={classroom} />
					))}
				</SimpleGrid>
			</Container>

			<CreateClassModal isOpen={isCreateOpen} onClose={onCreateClose} />
			<JoinClassModal isOpen={isJoinOpen} onClose={onJoinClose} />
		</Box>
	);
}
