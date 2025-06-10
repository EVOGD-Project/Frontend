'use client';

import { api } from '@/api/api';
import { CDN_URL } from '@/constants/constants';
import { authAtom, loadUser } from '@/store/auth';
import {
	Avatar,
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
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface EditAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function EditAccountModal({ isOpen, onClose }: Readonly<EditAccountModalProps>) {
	const [isLoading, setIsLoading] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const toast = useToast();
	const [auth, setAuth] = useAtom(authAtom);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			setAvatarFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.png', '.jpg', '.jpeg', '.gif']
		},
		maxFiles: 1,
		maxSize: 10 * 1024 * 1024
	});

	useEffect(() => {
		if (!isOpen) {
			setAvatarFile(null);
			setAvatarPreview(null);
		}
	}, [isOpen]);

	const handleSubmit = async () => {
		if (!avatarFile) {
			toast({
				title: 'Error',
				description: 'Por favor selecciona una imagen',
				status: 'error',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
			return;
		}

		setIsLoading(true);
		try {
			const res = await api.user.avatar();
			if (!res) throw new Error('Failed to get signed URL');

			const uploadRes = await fetch(res.url, {
				method: 'PUT',
				body: avatarFile,
				headers: {
					'Content-Type': avatarFile.type
				}
			});

			if (!uploadRes.ok) throw new Error('Failed to upload file to S3');

			if (auth.token) {
				const updatedUser = await loadUser(auth.token);
				setAuth((prev) => ({ ...prev, user: updatedUser }));
			}

			toast({
				title: 'Éxito',
				description: 'Tu avatar ha sido actualizado correctamente',
				status: 'success',
				position: 'top-right',
				duration: 3000,
				isClosable: true
			});
			onClose();
		} catch {
			toast({
				title: 'Error',
				description: 'Ha ocurrido un error al actualizar tu avatar',
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
				<ModalHeader>Editar Cuenta</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={6}>
						<FormControl>
							<FormLabel>Avatar</FormLabel>
							<VStack spacing={4}>
								<Avatar
									size='2xl'
									src={
										avatarPreview ||
										(auth.user?.avatar
											? `${CDN_URL}/avatars/${auth.user?.id}/${auth.user?.avatar}.png`
											: '')
									}
									cursor='pointer'
									name={auth.user?.username}
									{...(getRootProps() as any)}
								/>
								<Input {...(getInputProps() as any)} />
								<Button size='sm' variant='outline' {...getRootProps()}>
									Cambiar Avatar
								</Button>
							</VStack>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter gap={2}>
					<Button variant='ghost' onClick={onClose}>
						Cancelar
					</Button>
					<Button colorScheme='blue' onClick={handleSubmit} isLoading={isLoading} loadingText='Guardando...'>
						Guardar Cambios
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
