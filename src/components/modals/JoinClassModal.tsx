'use client';

import { api } from '@/api/api';
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
	VStack,
	useToast
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

interface JoinClassModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function JoinClassModal({ isOpen, onClose }: Readonly<JoinClassModalProps>) {
	const [isLoading, setIsLoading] = useState(false);
	const [code, setCode] = useState('');
	const [, setClassrooms] = useAtom(classroomsAtom);

	const toast = useToast();

	useEffect(() => {
		if (isOpen) {
			setCode('');
		}
	}, [isOpen]);

	const handleSubmit = async () => {
		if (!code.trim()) {
			toast({
				title: 'Error',
				description: 'Por favor ingresa el código de la clase',
				status: 'error',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
			return;
		}

		setIsLoading(true);
		try {
			await api.classroom.join(code);

			try {
				const data = await api.classroom.getAll();
				setClassrooms(data);
			} catch (error) {
				console.error('Failed to fetch classrooms:', error);
			}

			toast({
				title: 'Éxito',
				description: 'Te has unido a la clase correctamente',
				status: 'success',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
			onClose();
		} catch {
			toast({
				title: 'Error',
				description: 'El código de la clase es inválido',
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
				<ModalHeader>Unirse a una Clase</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Código de la Clase</FormLabel>
							<Input
								placeholder='Ej: ABC123'
								value={code}
								onChange={(e) => setCode(e.target.value)}
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
					</VStack>
				</ModalBody>

				<ModalFooter gap={2}>
					<Button variant='ghost' onClick={onClose}>
						Cancelar
					</Button>
					<Button colorScheme='blue' onClick={handleSubmit} isLoading={isLoading} loadingText='Uniéndose...'>
						Unirse
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
