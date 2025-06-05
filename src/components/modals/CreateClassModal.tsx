'use client';

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
	Textarea,
	VStack,
	useToast
} from '@chakra-ui/react';
import { useState } from 'react';

interface CreateClassModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function CreateClassModal({ isOpen, onClose }: Readonly<CreateClassModalProps>) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		image: ''
	});
	const toast = useToast();

	const handleSubmit = async () => {
		if (!formData.name.trim() || !formData.description.trim()) {
			toast({
				title: 'Error',
				description: 'Por favor completa todos los campos requeridos',
				status: 'error',
				duration: 3000,
				isClosable: true
			});
			return;
		}

		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast({
				title: 'Clase creada',
				description: 'La clase se ha creado exitosamente',
				status: 'success',
				duration: 3000,
				isClosable: true
			});
			onClose();
		} catch {
			toast({
				title: 'Error',
				description: 'Ocurrió un error al crear la clase',
				status: 'error',
				duration: 3000,
				isClosable: true
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='xl'>
			<ModalOverlay backdropFilter='blur(4px)' />
			<ModalContent bg='brand.dark.900' border='1px solid' borderColor='brand.dark.800'>
				<ModalHeader>Crear Nueva Clase</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Nombre de la Clase</FormLabel>
							<Input
								placeholder='Ej: Matemáticas Avanzadas'
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
