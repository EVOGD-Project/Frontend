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
	VStack,
	useToast
} from '@chakra-ui/react';
import { useState } from 'react';

interface JoinClassModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function JoinClassModal({ isOpen, onClose }: JoinClassModalProps) {
	const [code, setCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	const handleSubmit = async () => {
		if (!code.trim()) {
			toast({
				title: 'Error',
				description: 'Por favor ingresa el código de la clase',
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
				title: 'Éxito',
				description: 'Te has unido a la clase correctamente',
				status: 'success',
				duration: 3000,
				isClosable: true
			});
			onClose();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'El código ingresado no es válido',
				status: 'error',
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
								placeholder='Ingresa el código...'
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
