'use client';

import { api } from '@/api/api';
import { CDN_URL } from '@/constants/constants';
import { authAtom } from '@/store/auth';
import type { IActivity } from '@/types/IActivity';
import type { IClassroom } from '@/types/IClassroomCard';
import type { ISubmission } from '@/types/ISubmission';
import type { IUser } from '@/types/IUser';
import {
	Avatar,
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
	IconButton,
	Input,
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
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiCalendar, FiDownload, FiExternalLink, FiFileText, FiSend, FiUpload, FiX } from 'react-icons/fi';
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

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ActivityScreen({
	classroomId,
	activityId
}: Readonly<{ classroomId: string; activityId: string }>) {
	const [activity, setActivity] = useState<IActivity | null>(null);
	const [classroom, setClassroom] = useState<IClassroom | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [submissions, setSubmissions] = useState<(ISubmission & { user: IUser })[]>([]);
	const [userSubmission, setUserSubmission] = useState<ISubmission | null>(null);
	const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [comment, setComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [auth] = useAtom(authAtom);
	const toast = useToast();

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const validFiles = acceptedFiles.filter((file) => file.size <= MAX_FILE_SIZE);
			const invalidFiles = acceptedFiles.filter((file) => file.size > MAX_FILE_SIZE);

			if (invalidFiles.length > 0) {
				toast({
					title: 'Error',
					description: `Algunos archivos superan el límite de 10MB: ${invalidFiles.map((f) => f.name).join(', ')}`,
					status: 'error',
					position: 'top-right',
					duration: 5000,
					isClosable: true
				});
			}

			setFiles((prev) => [...prev, ...validFiles]);
		},
		[toast]
	);

	const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
		onDrop,
		maxFiles: 5,
		maxSize: MAX_FILE_SIZE,
		accept: {
			'application/pdf': ['.pdf'],
			'application/msword': ['.doc'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
			'application/vnd.ms-excel': ['.xls'],
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
			'application/vnd.ms-powerpoint': ['.ppt'],
			'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
			'text/plain': ['.txt'],
			'application/zip': ['.zip'],
			'application/x-rar-compressed': ['.rar'],
			'image/*': ['.png', '.jpg', '.jpeg', '.gif']
		},
		noClick: false,
		noKeyboard: false,
		preventDropOnDocument: true
	});

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [activityData, classroomData] = await Promise.all([
					api.activities.getById(classroomId, activityId),
					api.classroom.getById(classroomId)
				]);

				setActivity(activityData);
				setClassroom(classroomData);

				if (classroomData.owner === auth.user?.id && activityData.type === 'assignment') {
					setIsLoadingSubmissions(true);
					try {
						const submissionsData = await api.activities.getAllSubmissions(classroomId, activityId);
						setSubmissions(submissionsData);
					} catch (error) {
						console.error('Failed to fetch submissions:', error);
					} finally {
						setIsLoadingSubmissions(false);
					}
				} else if (activityData.type === 'assignment') {
					setIsLoadingSubmissions(true);
					try {
						const submission = await api.activities.getUserSubmission(classroomId, activityId);
						setUserSubmission(submission);
						setHasSubmitted(true);
					} catch (error) {
						console.error('Failed to fetch user submission:', error);
					} finally {
						setIsLoadingSubmissions(false);
					}
				}
			} catch {
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
	}, [activityId, classroomId, toast, auth.user?.id]);

	const handleSubmit = async () => {
		if (files.length === 0) {
			toast({
				title: 'Error',
				description: 'Por favor adjunta al menos un archivo',
				status: 'error',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
			return;
		}

		setIsSubmitting(true);
		try {
			for (const file of files) {
				const { url } = await api.activities.getSubmissionUrl(classroomId, activityId, file.name, comment);

				const uploadRes = await fetch(url, {
					method: 'PUT',
					body: file,
					headers: {
						'Content-Type': file.type
					}
				});

				if (!uploadRes.ok) {
					throw new Error(`Failed to upload file ${file.name}`);
				}
			}

			toast({
				title: 'Éxito',
				description: 'Tu tarea ha sido enviada correctamente',
				status: 'success',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});

			setHasSubmitted(true);
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Ha ocurrido un error al enviar la tarea',
				status: 'error',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<Flex h='100%' align='center' justify='center'>
				<Spinner size='xl' borderWidth='4px' />
			</Flex>
		);
	}

	if (!activity || !classroom) return null;

	const isProfessor = classroom.owner === auth.user?.id;
	const isAssignment = activity.type === 'assignment';

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
								<Link
									color='gray.400'
									href={`/classes/${encodeURIComponent(classroomId)}`}
									as={NextLink}
								>
									{classroom.name}
								</Link>
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

						<VStack spacing={4} align='stretch'>
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

							{isProfessor && isAssignment && (
								<Box
									bg='brand.dark.900'
									p={6}
									borderRadius='xl'
									border='1px solid'
									borderColor='brand.dark.800'
								>
									<Heading size='md' mb={4}>
										Entregas de Estudiantes
									</Heading>
									{isLoadingSubmissions ? (
										<Flex justify='center' py={4}>
											<Spinner />
										</Flex>
									) : submissions.length > 0 ? (
										<VStack spacing={4} align='stretch'>
											{submissions.map((submission) => (
												<Box key={submission.id} p={4} bg='brand.dark.800' borderRadius='lg'>
													<Flex justify='space-between' align='center' mb={3}>
														<Flex align='center' gap={3}>
															<Avatar
																size='sm'
																name={submission.user?.username}
																src={
																	submission.user?.avatar
																		? `${CDN_URL}/avatars/${submission.user?.id}/${submission.user?.avatar}.png`
																		: ''
																}
															/>
															<VStack align='start' spacing={0}>
																<Text fontWeight='bold'>
																	{submission.user?.username}
																</Text>
																<Text fontSize='sm' color='gray.400'>
																	Entregado el{' '}
																	{format(
																		new Date(submission.submittedAt),
																		"d 'de' MMMM 'a las' HH:mm",
																		{ locale: es }
																	)}
																</Text>
															</VStack>
														</Flex>
													</Flex>
													<VStack align='stretch' spacing={2}>
														{submission.comment && (
															<Text>
																<b>Comentario</b>: {submission.comment}
															</Text>
														)}
														{submission.files.map((file, index) => (
															<Flex
																key={index}
																justify='space-between'
																align='center'
																p={2}
																bg='brand.dark.900'
																borderRadius='md'
															>
																<Text fontSize='sm'>{file.name}</Text>
																<Link
																	href={`${CDN_URL}/submissions/${file.url}`}
																	isExternal
																	_hover={{ textDecoration: 'none' }}
																>
																	<Button
																		size='sm'
																		variant='ghost'
																		leftIcon={<FiDownload />}
																	>
																		Descargar
																	</Button>
																</Link>
															</Flex>
														))}
													</VStack>
												</Box>
											))}
										</VStack>
									) : (
										<Text color='gray.400'>Aún no hay entregas para esta tarea.</Text>
									)}
								</Box>
							)}

							{!isProfessor && isAssignment && (
								<Box
									bg='brand.dark.900'
									p={6}
									borderRadius='xl'
									border='1px solid'
									borderColor='brand.dark.800'
								>
									<Heading size='md' mb={4}>
										Enviar Tarea
									</Heading>
									{isLoadingSubmissions ? (
										<Flex justify='center' py={4}>
											<Spinner />
										</Flex>
									) : hasSubmitted ? (
										<VStack spacing={4} align='stretch'>
											<Text color='green.400' mb={2}>
												¡Tu tarea ha sido enviada! El profesor la revisará pronto.
											</Text>
											{userSubmission && (
												<Box>
													{userSubmission.comment && (
														<Text fontWeight='semibold' color='gray.100'>
															Comentario:
														</Text>
													)}
													{userSubmission.comment && (
														<Text mb={4}>{userSubmission.comment}</Text>
													)}
													<Text fontWeight='semibold' color='gray.1s00' mb={2}>
														Archivos enviados:
													</Text>
													<VStack spacing={2} align='stretch'>
														{userSubmission.files.map((file, index) => (
															<Flex
																key={index}
																justify='space-between'
																align='center'
																p={2}
																bg='brand.dark.800'
																borderRadius='md'
															>
																<Text color='gray.300' fontSize='sm'>
																	{file.name}
																</Text>
																<Link
																	href={`${CDN_URL}/submissions/${file.url}`}
																	isExternal
																	_hover={{ textDecoration: 'none' }}
																>
																	<Button
																		size='sm'
																		variant='ghost'
																		leftIcon={<FiDownload />}
																	>
																		Descargar
																	</Button>
																</Link>
															</Flex>
														))}
													</VStack>
													<Text fontSize='sm' color='gray.400' mt={2}>
														Enviado el{' '}
														{format(
															new Date(userSubmission.submittedAt),
															"d 'de' MMMM 'a las' HH:mm",
															{ locale: es }
														)}
													</Text>
												</Box>
											)}
										</VStack>
									) : (
										<VStack spacing={4} align='stretch'>
											<Box
												{...getRootProps()}
												p={6}
												borderRadius='lg'
												borderWidth={2}
												borderStyle='dashed'
												borderColor={
													isDragAccept
														? 'green.500'
														: isDragReject
															? 'red.500'
															: isDragActive
																? 'brand.primary.500'
																: 'brand.dark.700'
												}
												bg={isDragActive ? 'brand.dark.700' : 'brand.dark.800'}
												cursor='pointer'
												transition='all 0.2s'
												_hover={{
													borderColor: 'brand.primary.500',
													bg: 'brand.dark.700'
												}}
												position='relative'
												outline='none'
											>
												<input {...getInputProps()} />
												<VStack spacing={2} align='center'>
													<Icon
														as={FiUpload}
														fontSize='2xl'
														color={
															isDragAccept
																? 'green.500'
																: isDragReject
																	? 'red.500'
																	: isDragActive
																		? 'brand.primary.500'
																		: 'gray.400'
														}
													/>
													<Text
														color={
															isDragAccept
																? 'green.500'
																: isDragReject
																	? 'red.500'
																	: isDragActive
																		? 'brand.primary.500'
																		: 'gray.400'
														}
														textAlign='center'
													>
														{isDragAccept
															? 'Suelta para subir los archivos'
															: isDragReject
																? 'Algunos archivos no son válidos'
																: isDragActive
																	? 'Suelta los archivos aquí'
																	: 'Arrastra archivos aquí o haz clic para seleccionar'}
													</Text>
													<Text fontSize='sm' color='gray.500'>
														Máximo 5 archivos, 10MB por archivo
													</Text>
												</VStack>
											</Box>

											{files.length > 0 && (
												<VStack spacing={2} align='stretch'>
													<Text fontWeight='medium' color='gray.300'>
														Archivos adjuntos:
													</Text>
													{files.map((file, index) => (
														<Flex
															key={index}
															justify='space-between'
															align='center'
															p={2}
															bg='brand.dark.800'
															borderRadius='md'
														>
															<Text color='gray.300' fontSize='sm'>
																{file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
															</Text>
															<IconButton
																aria-label='Eliminar archivo'
																icon={<FiX />}
																size='sm'
																variant='ghost'
																colorScheme='red'
																onClick={(e) => {
																	e.stopPropagation();
																	removeFile(index);
																}}
															/>
														</Flex>
													))}
												</VStack>
											)}

											<Input
												placeholder='Comentario (opcional)'
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												bg='brand.dark.800'
												border='1px solid'
												borderColor='brand.dark.700'
												_hover={{ borderColor: 'brand.primary.500' }}
												_focus={{
													borderColor: 'brand.primary.500',
													boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary-500)'
												}}
											/>

											<Button
												colorScheme='blue'
												leftIcon={<FiSend />}
												isLoading={isSubmitting}
												loadingText='Enviando...'
												onClick={handleSubmit}
											>
												Enviar Tarea
											</Button>
										</VStack>
									)}
								</Box>
							)}
						</VStack>
					</Grid>
				</Container>
			</Box>
		</Box>
	);
}
