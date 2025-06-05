'use client';

import type { IActivity } from '@/types/IActivity';
import {
	Button,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Stack,
	Textarea,
	VStack,
	useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiTrash } from 'react-icons/fi';

interface CreateActivityModalProps {
	isOpen: boolean;
	onClose: () => void;
	classroomId: string;
	onActivityCreated?: (activity: IActivity) => void;
}

export default function CreateActivityModal({
	isOpen,
	onClose,
	classroomId,
	onActivityCreated
}: Readonly<CreateActivityModalProps>) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		type: 'assignment' as IActivity['type'],
		dueDate: '',
		content: {
			instructions: '',
			resources: [] as Array<{ type: 'link' | 'file'; name: string; url: string }>
		}
	});
	const toast = useToast();

	const handleSubmit = async () => {
		if (!formData.title.trim() || !formData.description.trim() || !formData.type) {
			toast({
				title: 'Error',
				description: 'Por favor completa todos los campos requeridos',
				status: 'error',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
			return;
		}

		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newActivity: IActivity = {
				id: Math.random().toString(36).substring(7),
				...formData,
				classroomId,
				createdAt: new Date().toISOString()
			};

			onActivityCreated?.(newActivity);

			toast({
				title: 'Actividad creada',
				description: 'La actividad se ha creado exitosamente',
				status: 'success',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
			onClose();
		} catch {
			toast({
				title: 'Error',
				description: 'Ocurrió un error al crear la actividad',
				status: 'error',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
		} finally {
			setIsLoading(false);
		}
	};

	const addResource = () => {
		setFormData((prev) => ({
			...prev,
			content: {
				...prev.content,
				resources: [
					...prev.content.resources,
					{
						type: 'link',
						name: '',
						url: ''
					}
				]
			}
		}));
	};

	const removeResource = (index: number) => {
		setFormData((prev) => ({
			...prev,
			content: {
				...prev.content,
				resources: prev.content.resources.filter((_, i) => i !== index)
			}
		}));
	};

	const updateResource = (index: number, field: keyof (typeof formData.content.resources)[0], value: string) => {
		setFormData((prev) => ({
			...prev,
			content: {
				...prev.content,
				resources: prev.content.resources.map((resource, i) =>
					i === index ? { ...resource, [field]: value } : resource
				)
			}
		}));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='xl'>
			<ModalOverlay backdropFilter='blur(4px)' />
			<ModalContent bg='brand.dark.900' border='1px solid' borderColor='brand.dark.800'>
				<ModalHeader>Crear Nueva Actividad</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Título</FormLabel>
							<Input
								placeholder='Ej: Tarea 1 - Introducción'
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								bg='brand.dark.800'
								border='1px solid'
								borderColor='brand.dark.700'
								_hover={{ borderColor: 'brand.primary.500' }}
								_focus={{
									borderColor: 'brand.primary.500',
									boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary-500)'
								}}
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel>Descripción</FormLabel>
							<Textarea
								placeholder='Describe la actividad...'
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								bg='brand.dark.800'
								border='1px solid'
								borderColor='brand.dark.700'
								_hover={{ borderColor: 'brand.primary.500' }}
								_focus={{
									borderColor: 'brand.primary.500',
									boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary-500)'
								}}
								rows={4}
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel>Tipo</FormLabel>
							<Select
								value={formData.type}
								onChange={(e) =>
									setFormData({ ...formData, type: e.target.value as IActivity['type'] })
								}
								bg='brand.dark.800'
								border='1px solid'
								borderColor='brand.dark.700'
								_hover={{ borderColor: 'brand.primary.500' }}
								_focus={{
									borderColor: 'brand.primary.500',
									boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary-500)'
								}}
							>
								<option value='assignment'>Tarea</option>
								<option value='material'>Material</option>
							</Select>
						</FormControl>

						{formData.type !== 'material' && (
							<FormControl>
								<FormLabel>Fecha de entrega</FormLabel>
								<Input
									type='datetime-local'
									value={formData.dueDate}
									onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
									bg='brand.dark.800'
									border='1px solid'
									borderColor='brand.dark.700'
									_hover={{ borderColor: 'brand.primary.500' }}
									_focus={{
										borderColor: 'brand.primary.500',
										boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary-500)'
									}}
								/>
							</FormControl>
						)}

						<FormControl>
							<FormLabel>Instrucciones (Markdown)</FormLabel>
							<Textarea
								placeholder='Escribe las instrucciones usando Markdown...'
								value={formData.content.instructions}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										content: { ...prev.content, instructions: e.target.value }
									}))
								}
								bg='brand.dark.800'
								border='1px solid'
								borderColor='brand.dark.700'
								_hover={{ borderColor: 'brand.primary.500' }}
								_focus={{
									borderColor: 'brand.primary.500',
									boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary-500)'
								}}
								rows={8}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Recursos</FormLabel>
							<VStack spacing={4} align='stretch'>
								{formData.content.resources.map((resource, index) => (
									<Stack
										key={index}
										direction={{ base: 'column', md: 'row' }}
										spacing={2}
										bg='brand.dark.800'
										p={4}
										borderRadius='md'
									>
										<FormControl>
											<Select
												value={resource.type}
												onChange={(e) =>
													updateResource(index, 'type', e.target.value as 'link' | 'file')
												}
												size='sm'
											>
												<option value='link'>Enlace</option>
												<option value='file'>Archivo</option>
											</Select>
										</FormControl>
										<FormControl>
											<Input
												placeholder='Nombre del recurso'
												value={resource.name}
												onChange={(e) => updateResource(index, 'name', e.target.value)}
												size='sm'
											/>
										</FormControl>
										<FormControl>
											<Input
												placeholder='URL del recurso'
												value={resource.url}
												onChange={(e) => updateResource(index, 'url', e.target.value)}
												size='sm'
											/>
										</FormControl>
										<IconButton
											aria-label='Eliminar recurso'
											icon={<FiTrash />}
											onClick={() => removeResource(index)}
											variant='ghost'
											colorScheme='red'
											size='sm'
										/>
									</Stack>
								))}
								<Button
									leftIcon={<FiPlus />}
									variant='ghost'
									size='sm'
									onClick={addResource}
									alignSelf='start'
								>
									Agregar recurso
								</Button>
							</VStack>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter gap={2}>
					<Button variant='ghost' onClick={onClose}>
						Cancelar
					</Button>
					<Button colorScheme='blue' onClick={handleSubmit} isLoading={isLoading} loadingText='Creando...'>
						Crear Actividad
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
