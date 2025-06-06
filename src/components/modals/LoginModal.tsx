'use client';

import { authAtom, loadUser } from '@/store/auth';
import {
	Button,
	Flex,
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
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onRegisterClick: () => void;
}

export default function LoginModal({ isOpen, onClose, onRegisterClick }: Readonly<LoginModalProps>) {
	const setAuth = useSetAtom(authAtom);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	useEffect(() => {
		if (isOpen) {
			setFormData({
				email: '',
				password: ''
			});
		}
	}, [isOpen]);

	const toast = useToast();

	const handleSubmit = async () => {
		if (!formData.email.trim() || !formData.password.trim()) {
			toast({
				title: 'Error',
				description: 'Por favor completa todos los campos',
				position: 'top-right',
				status: 'error',
				duration: 3000,
				isClosable: true
			});
			return;
		}

		setIsLoading(true);
		try {
			const res = await fetch('https://evogd-api.tnfangel.com/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!res.ok)
				return toast({
					title: 'Error',
					description: 'Las credenciales son incorrectas',
					position: 'top-right',
					status: 'error',
					duration: 3000,
					isClosable: true
				});

			const data = await res.json();

			if (!data?.token)
				return toast({
					title: 'Error',
					description: 'Las credenciales son incorrectas',
					position: 'top-right',
					status: 'error',
					duration: 3000,
					isClosable: true
				});

			localStorage.setItem('token', data.token);
			const user = await loadUser(data.token);
			setAuth((prev) => ({ ...prev, token: data.token, user }));

			toast({
				title: 'Éxito',
				description: 'Has iniciado sesión correctamente',
				position: 'top-right',
				status: 'success',
				duration: 3000,
				isClosable: true
			});
			onClose();
		} catch {
			toast({
				title: 'Error',
				description: 'Las credenciales son incorrectas',
				position: 'top-right',
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
				<ModalHeader>Iniciar Sesión</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Correo Electrónico</FormLabel>
							<Input
								type='email'
								placeholder='ejemplo@correo.com'
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
							<FormLabel>Contraseña</FormLabel>
							<Input
								type='password'
								placeholder='Tu contraseña'
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

				<ModalFooter gap={2} flexWrap='wrap' justifyContent='space-between'>
					<Button variant='link' onClick={onRegisterClick} size='sm'>
						¿No tienes cuenta? Regístrate
					</Button>
					<Flex gap={2}>
						<Button variant='ghost' onClick={onClose}>
							Cancelar
						</Button>
						<Button
							colorScheme='blue'
							onClick={handleSubmit}
							isLoading={isLoading}
							loadingText='Iniciando...'
						>
							Iniciar Sesión
						</Button>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
