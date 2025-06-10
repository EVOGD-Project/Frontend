'use client';

import { api } from '@/api/api';
import { authAtom } from '@/store/auth';
import { classroomsAtom } from '@/store/classrooms';
import type { IClassroom } from '@/types/IClassroomCard';
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Textarea,
	VStack,
	useToast
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

interface CreateClassModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function CreateClassModal({ isOpen, onClose }: Readonly<CreateClassModalProps>) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		thumbnailId: 1
	});
	const [, setClassrooms] = useAtom(classroomsAtom);

	const toast = useToast();

	useEffect(() => {
		if (isOpen) {
			setFormData({
				name: '',
				description: '',
				thumbnailId: 1
			});
		}
	}, [isOpen]);

	const handleSubmit = async () => {
		if (!formData.name.trim() || !formData.description.trim()) {
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
			await api.classroom.create(formData);

			try {
				const data = await api.classroom.getAll();
				setClassrooms(data);
			} catch (error) {
				console.error('Failed to fetch classrooms:', error);
			}
			toast({
				title: 'Clase creada',
				description: 'La clase se ha creado exitosamente',
				status: 'success',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
			onClose();
		} catch {
			toast({
				title: 'Error',
				description: 'Ocurrió un error al crear la clase',
				status: 'error',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay backdropFilter='blur(4px)' />
			<ModalContent bg='brand.dark.900' border='1px solid' borderColor='brand.dark.800'>
				<ModalHeader>Crear Nueva Clase</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Nombre</FormLabel>
							<Input
								placeholder='Ej: Programación Web'
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
								placeholder='Describe tu clase...'
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

						<FormControl>
							<FormLabel>Imagen de portada</FormLabel>
							<Select
								value={formData.thumbnailId}
								onChange={(e) => setFormData({ ...formData, thumbnailId: Number(e.target.value) })}
								bg='brand.dark.800'
								border='1px solid'
								borderColor='brand.dark.700'
								_hover={{ borderColor: 'brand.primary.500' }}
								_focus={{
									borderColor: 'brand.primary.500',
									boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary-500)'
								}}
							>
								{Array.from({ length: 9 }, (_, i) => (
									<option key={i + 1} value={i + 1}>
										Imagen {i + 1}
									</option>
								))}
							</Select>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter gap={2}>
					<Button variant='ghost' onClick={onClose}>
						Cancelar
					</Button>
					<Button colorScheme='blue' onClick={handleSubmit} isLoading={isLoading} loadingText='Creando...'>
						Crear Clase
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
