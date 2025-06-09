'use client';

import { api } from '@/api/api';
import type { IActivity } from '@/types/IActivity';
import type { IClassroom } from '@/types/IClassroomCard';
import {
	Badge,
	Box,
	Button,
	Code,
	Container,
	Divider,
	Flex,
	Grid,
	Heading,
	Icon,
	Link,
	ListItem,
	OrderedList,
	Spinner,
	Text,
	UnorderedList,
	VStack,
	useToast
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { FiCalendar, FiDownload, FiExternalLink, FiFileText } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const activityTypeInfo = {
	assignment: {
		label: 'Tarea',
		color: 'blue'
	},
	material: {
		label: 'Material',
		color: 'green'
	}
} as const;

export default function ActivityScreen({
	classroomId,
	activityId
}: Readonly<{ classroomId: string; activityId: string }>) {
	const [activity, setActivity] = useState<IActivity | null>(null);
	const [classroom, setClassroom] = useState<IClassroom | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const toast = useToast();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [activityData, classroomData] = await Promise.all([
					api.activities.getById(classroomId, activityId),
					api.classroom.getById(classroomId)
				]);

				setActivity(activityData);
				setClassroom(classroomData);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'No se pudo cargar la información de la actividad',
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
	}, [activityId, classroomId, toast]);

	if (isLoading) {
		return (
			<Flex h='100%' align='center' justify='center'>
				<Spinner size='xl' borderWidth='4px' />
			</Flex>
		);
	}

	if (!activity || !classroom) return null;

	return (
		<Box as='main' className='animate-fade-in'>
			<Box bg='brand.dark.900' py={8}>
				<Container maxW='container.xl'>
					<Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6} alignItems='center'>
						<VStack spacing={4} align='stretch'>
							<Flex gap={4} align='center'>
								<Badge
									colorScheme={activityTypeInfo[activity.type].color}
									px={2}
									py={1}
									borderRadius='md'
								>
									{activityTypeInfo[activity.type].label}
								</Badge>
								<Text color='gray.400'>{classroom.name}</Text>
							</Flex>
							<Heading
								as='h1'
								size='xl'
								bgGradient='linear(to-r, white, brand.primary.400)'
								bgClip='text'
							>
								{activity.title}
							</Heading>

							<Text fontSize='lg' color='gray.400' whiteSpace='pre-wrap'>
								{activity.description}
							</Text>
						</VStack>

						<VStack spacing={4} align='stretch'>
							{activity.dueDate && (
								<Flex align='center' gap={2} color='gray.400'>
									<Icon as={FiCalendar} />
									<Text>
										Fecha límite:{' '}
										{format(new Date(activity.dueDate), "d 'de' MMMM 'a las' HH:mm", {
											locale: es
										})}
									</Text>
								</Flex>
							)}

							<Flex align='center' gap={2} color='gray.400'>
								<Icon as={FiFileText} />
								<Text>
									Creado el{' '}
									{format(new Date(activity.createdAt), "d 'de' MMMM 'a las' HH:mm", {
										locale: es
									})}
								</Text>
							</Flex>
						</VStack>
					</Grid>
				</Container>
			</Box>

			<Box>
				<Container maxW='container.xl' py={8}>
					<Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} alignItems='start'>
						{activity.content.instructions && (
							<Box
								bg='brand.dark.900'
								p={6}
								borderRadius='xl'
								border='1px solid'
								borderColor='brand.dark.800'
							>
								<Box className='markdown-content' color='gray.300'>
									<ReactMarkdown
										components={{
											h1: ({ children }) => (
												<Heading
													as='h1'
													size='lg'
													mb={4}
													pb={3}
													borderBottom='1px solid'
													borderColor='brand.dark.700'
												>
													{children}
												</Heading>
											),
											h2: ({ children }) => (
												<Heading
													as='h2'
													size='md'
													mb={3}
													pb={2}
													borderBottom='1px solid'
													borderColor='brand.dark.700'
												>
													{children}
												</Heading>
											),
											h3: ({ children }) => (
												<Heading as='h3' size='sm' mb={2}>
													{children}
												</Heading>
											),
											p: ({ children }) => (
												<Text mb={4} lineHeight='tall'>
													{children}
												</Text>
											),
											ul: ({ children }) => (
												<UnorderedList mb={4} spacing={2} pl={4}>
													{children}
												</UnorderedList>
											),
											ol: ({ children }) => (
												<OrderedList mb={4} spacing={2} pl={4}>
													{children}
												</OrderedList>
											),
											li: ({ children }) => <ListItem lineHeight='tall'>{children}</ListItem>,
											code: ({ children }) => (
												<Code
													p={2}
													borderRadius='md'
													bg='brand.dark.800'
													fontSize='sm'
													color='brand.primary.300'
												>
													{children}
												</Code>
											)
										}}
									>
										{activity.content.instructions}
									</ReactMarkdown>
								</Box>
							</Box>
						)}

						{activity.content.resources && activity.content.resources.length > 0 && (
							<Box
								bg='brand.dark.900'
								p={6}
								borderRadius='xl'
								border='1px solid'
								borderColor='brand.dark.800'
							>
								<Heading size='md' mb={4}>
									Recursos
								</Heading>
								<VStack spacing={3} align='stretch'>
									{activity.content.resources.map((resource, index) => (
										<>
											{index > 0 && <Divider borderColor='brand.dark.700' />}
											<Flex key={resource.url} justify='space-between' align='center' gap={4}>
												<Text color='gray.300'>{resource.name}</Text>
												<Link
													href={resource.url}
													isExternal
													_hover={{ textDecoration: 'none' }}
												>
													<Button
														size='sm'
														variant='ghost'
														leftIcon={
															<Icon
																as={
																	resource.type === 'file'
																		? FiDownload
																		: FiExternalLink
																}
															/>
														}
													>
														{resource.type === 'file' ? 'Descargar' : 'Abrir'}
													</Button>
												</Link>
											</Flex>
										</>
									))}
								</VStack>
							</Box>
						)}
					</Grid>
				</Container>
			</Box>
		</Box>
	);
}
