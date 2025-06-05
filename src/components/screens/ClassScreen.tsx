'use client';

import { activities } from '@/mocks/activities';
import { classrooms } from '@/mocks/classrooms';
import type { IActivity } from '@/types/IActivity';
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
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiCode, FiFileText, FiPlus, FiUsers } from 'react-icons/fi';
import ActivityCard from '../general/ActivityCard';
import CreateActivityModal from '../modals/CreateActivityModal';

export default function ClassScreen({ id }: Readonly<{ id: string }>) {
	const classroom = classrooms.find((c) => c.id === id);
	const router = useRouter();
	const [classActivities, setClassActivities] = useState<IActivity[]>(
		activities.filter((activity) => activity.classroomId === id)
	);
	const { isOpen, onOpen, onClose } = useDisclosure();

	if (!classroom && typeof location !== 'undefined') location.href = '/';

	const handleActivityCreated = (activity: IActivity) => {
		setClassActivities((prev) => [...prev, activity]);
	};

	return classroom ? (
		<Box as='main' className='animate-fade-in'>
			<Box bg='brand.dark.900' py={12} position='relative' overflow='hidden'>
				<Box position='absolute' top={0} left={0} right={0} height='200px' opacity={0.3} filter='blur(8px)'>
					<Image
						src={`https://evogd-cdn.tnfangel.com/thumbnails/thumbnail-${classroom.thumbnailId}.jpg`}
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
									<Text>24 estudiantes</Text>
								</Flex>
								<Flex align='center' gap={2}>
									<Icon as={FiCode} />
									<Text>Código: {classroom.code}</Text>
								</Flex>
							</Flex>
						</Stack>

						<VStack spacing={2} align='center'>
							<Avatar
								size='xl'
								name={classroom.owner}
								src='https://avatars.githubusercontent.com/u/57068341?v=4'
							/>
							<Text color='gray.300'>Ángel</Text>
						</VStack>
					</Grid>
				</Container>
			</Box>

			<Box>
				<Container maxW='container.xl'>
					<Tabs variant='unstyled'>
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
										<Text>Estudiantes</Text>
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
											<Heading size='lg' mb={6}>
												Estudiantes
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
													p={4}
													gap={4}
													align='center'
													bg='brand.dark.900'
													borderRadius='xl'
													border='1px solid'
													borderColor='brand.dark.800'
												>
													<Avatar
														size='md'
														name='Ángel'
														src='https://avatars.githubusercontent.com/u/57068341?v=4'
													/>
													<Box>
														<Text fontWeight='bold'>Ángel</Text>
														<Text fontSize='sm' color='brand.primary.400'>
															Profesor
														</Text>
													</Box>
												</Flex>

												{Array.from({ length: 5 }).map((_, i) => (
													<Flex
														key={i}
														p={4}
														gap={4}
														align='center'
														bg='brand.dark.900'
														borderRadius='xl'
														border='1px solid'
														borderColor='brand.dark.800'
													>
														<Avatar size='md' name={`Estudiante ${i + 1}`} />
														<Box>
															<Text fontWeight='bold'>Estudiante {i + 1}</Text>
															<Text fontSize='sm' color='gray.400'>
																Estudiante
															</Text>
														</Box>
													</Flex>
												))}
											</Grid>
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
	) : null;
}
