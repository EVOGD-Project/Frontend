'use client';

import { api } from '@/api/api';
import { CDN_URL } from '@/constants/constants';
import { authAtom } from '@/store/auth';
import type { IActivity } from '@/types/IActivity';
import type { IClassroom } from '@/types/IClassroomCard';
import type { IUser } from '@/types/IUser';
import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	Grid,
	Heading,
	Icon,
	Image,
	Spinner,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	VStack,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiCode, FiFileText, FiPlus, FiUsers } from 'react-icons/fi';
import ActivityCard from '../general/ActivityCard';
import CreateActivityModal from '../modals/CreateActivityModal';

export default function ClassroomScreen({ id }: Readonly<{ id: string }>) {
	const [classroom, setClassroom] = useState<IClassroom | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const [classActivities, setClassActivities] = useState<IActivity[]>([]);
	const [classMembers, setClassMembers] = useState<IUser[]>([]);
	const [professor, setProfessor] = useState<IUser | null>(null);
	const [isMembersLoading, setIsMembersLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [auth] = useAtom(authAtom);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [classroomData, activitiesData, professorData] = await Promise.all([
					api.classroom.getById(id),
					api.activities.getByClassroom(id),
					api.classroom.getProfessor(id)
				]);

				setClassroom(classroomData);
				setClassActivities(activitiesData);
				setProfessor(professorData);
			} catch {
				toast({
					title: 'Error',
					description: 'No se pudo cargar la información de la clase',
					status: 'error',
					position: 'top-right',
					duration: 3000,
					isClosable: true
				});
				if (typeof location !== 'undefined') location.href = '/';
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, toast]);

	const handleActivityCreated = (activity: IActivity) => {
		setClassActivities((prev) => [...prev, activity]);
	};

	const handleTabChange = async (index: number) => {
		if (index === 1 && classMembers.length === 0) {
			setIsMembersLoading(true);
			try {
				const members = await api.classroom.getMembers(id);
				setClassMembers(members);
			} catch {
				toast({
					title: 'Error',
					description: 'No se pudo cargar la lista de estudiantes',
					status: 'error',
					position: 'top-right',
					duration: 3000,
					isClosable: true
				});
			} finally {
				setIsMembersLoading(false);
			}
		}
	};

	if (isLoading) {
		return (
			<Flex h='100%' align='center' justify='center'>
				<Spinner size='xl' borderWidth='4px' />
			</Flex>
		);
	}

	if (!classroom) return null;

	return (
		<Box as='main' className='animate-fade-in'>
			<Box bg='brand.dark.900' py={12} position='relative' overflow='hidden'>
				<Box position='absolute' top={0} left={0} right={0} height='200px' opacity={0.3} filter='blur(8px)'>
					<Image
						src={`${CDN_URL}/thumbnails/thumbnail-${classroom.thumbnailId}.jpg`}
						alt={classroom.name}
						width='100%'
						height='100%'
						objectFit='cover'
						objectPosition='center'
					/>
					<Box
						position='absolute'
						bottom={0}
						left={0}
						right={0}
						height='100%'
						bgGradient='linear(to-t, brand.dark.900 10%, transparent)'
					/>
				</Box>

				<Container maxW='container.xl' position='relative'>
					<Grid
						templateColumns={{ base: '1fr', md: '1fr auto' }}
						gap={{ base: 6, md: 12 }}
						alignItems='center'
					>
						<Stack spacing={6}>
							<Heading
								as='h1'
								size='xl'
								bgGradient='linear(to-r, white, brand.primary.400)'
								bgClip='text'
							>
								{classroom.name}
							</Heading>
							<Text fontSize='lg' color='gray.400'>
								{classroom.description || 'Sin descripción.'}
							</Text>
							<Flex gap={6} color='gray.400'>
								<Flex align='center' gap={2}>
									<Icon as={FiUsers} />
									<Text>
										{classroom.memberCount === 1 ? 'Sin ' : classroom.memberCount - 1} estudiantes
									</Text>
								</Flex>
								{classroom.owner === auth.user?.id && (
									<Flex align='center' gap={2}>
										<Icon as={FiCode} />
										<Text>Código: {classroom.code}</Text>
									</Flex>
								)}
							</Flex>
						</Stack>

						<VStack spacing={2} align='center'>
							<Avatar size='xl' name={professor?.username} src={professor?.avatar ?? ''} />
							<Text color='gray.300'>{professor?.username}</Text>
						</VStack>
					</Grid>
				</Container>
			</Box>

			<Box>
				<Container maxW='container.xl'>
					<Tabs variant='unstyled' onChange={handleTabChange}>
						<Box borderBottom='1px solid' borderColor='brand.dark.800'>
							<TabList gap={4}>
								<Tab
									py={4}
									color='gray.400'
									_selected={{
										color: 'brand.primary.400',
										borderBottom: '2px solid',
										borderColor: 'brand.primary.400'
									}}
									_hover={{ color: 'brand.primary.400' }}
								>
									<Flex align='center' gap={2}>
										<FiFileText />
										<Text>Actividades</Text>
									</Flex>
								</Tab>
								<Tab
									py={4}
									color='gray.400'
									_selected={{
										color: 'brand.primary.400',
										borderBottom: '2px solid',
										borderColor: 'brand.primary.400'
									}}
									_hover={{ color: 'brand.primary.400' }}
								>
									<Flex align='center' gap={2}>
										<FiUsers />
										<Text>Miembros</Text>
									</Flex>
								</Tab>
							</TabList>
						</Box>

						<Box py={8}>
							<TabPanels>
								<TabPanel p={0} className='animate-fade-in'>
									<VStack spacing={8} align='stretch'>
										<Flex justify='space-between' align='center'>
											<Heading size='lg'>Actividades</Heading>
											<Button leftIcon={<FiPlus />} colorScheme='blue' onClick={onOpen} size='sm'>
												Crear actividad
											</Button>
										</Flex>

										{classActivities.length > 0 ? (
											<Grid
												templateColumns={{
													base: '1fr',
													sm: 'repeat(2, 1fr)',
													lg: 'repeat(3, 1fr)'
												}}
												gap={4}
											>
												{classActivities.map((activity) => (
													<ActivityCard
														key={activity.id}
														activity={activity}
														onClick={() =>
															router.push(`/classes/${id}/activities/${activity.id}`)
														}
													/>
												))}
											</Grid>
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
													No hay actividades disponibles
												</Text>
												<Button variant='outline' onClick={onOpen}>
													Crear actividad
												</Button>
											</Flex>
										)}
									</VStack>
								</TabPanel>

								<TabPanel p={0} className='animate-fade-in'>
									<VStack spacing={8} align='stretch'>
										<Box>
											{professor && (
												<>
													<Heading size='lg' mb={6}>
														Profesor
													</Heading>
													<Grid
														templateColumns={{
															base: '1fr',
															sm: 'repeat(2, 1fr)',
															md: 'repeat(3, 1fr)'
														}}
														gap={4}
													>
														<Flex
															key={professor.id}
															p={4}
															gap={4}
															align='center'
															bg='brand.dark.900'
															borderRadius='xl'
															border='1px solid'
															borderColor='brand.dark.800'
															mb='20px'
														>
															<Avatar size='md' name={professor.username} />
															<Box>
																<Text fontWeight='bold'>{professor.username}</Text>
																<Text fontSize='sm' color='brand.400'>
																	Profesor
																</Text>
															</Box>
														</Flex>
													</Grid>
												</>
											)}
											<Heading size='lg' mb={6}>
												Estudiantes
											</Heading>
											{isMembersLoading ? (
												<Flex justify='center' py={8}>
													<Spinner size='xl' />
												</Flex>
											) : (
												<Grid
													templateColumns={{
														base: '1fr',
														sm: 'repeat(2, 1fr)',
														md: 'repeat(3, 1fr)'
													}}
													gap={4}
												>
													{classMembers
														.filter((m) => m.id !== classroom.owner)
														.map((member) => (
															<Flex
																key={member.id}
																p={4}
																gap={4}
																align='center'
																bg='brand.dark.900'
																borderRadius='xl'
																border='1px solid'
																borderColor='brand.dark.800'
															>
																<Avatar size='md' name={member.username} />
																<Box>
																	<Text fontWeight='bold'>{member.username}</Text>
																	<Text fontSize='sm' color='gray.400'>
																		Estudiante
																	</Text>
																</Box>
															</Flex>
														))}
												</Grid>
											)}
										</Box>
									</VStack>
								</TabPanel>
							</TabPanels>
						</Box>
					</Tabs>
				</Container>
			</Box>

			<CreateActivityModal
				isOpen={isOpen}
				onClose={onClose}
				classroomId={id}
				onActivityCreated={handleActivityCreated}
			/>
		</Box>
	);
}
