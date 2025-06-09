'use client';

import { authAtom } from '@/store/auth';
import {
	Box,
	Button,
	Container,
	Flex,
	HStack,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spinner,
	Stack,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { FiBook, FiLogIn, FiMenu, FiUser } from 'react-icons/fi';
import CreateClassModal from '../modals/CreateClassModal';
import JoinClassModal from '../modals/JoinClassModal';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';

const NAV_ITEMS = [
	{
		label: 'Inicio',
		href: '/'
	},
	{
		label: 'Mis Clases',
		href: '/classes'
	}
];

export default function Navbar() {
	const router = useRouter();
	const [auth, setAuth] = useAtom(authAtom);
	const { isOpen: isMenuOpen, onToggle: onMenuToggle } = useDisclosure();
	const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
	const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();
	const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
	const { isOpen: isRegisterOpen, onOpen: onRegisterOpen, onClose: onRegisterClose } = useDisclosure();

	const handleLoginClick = () => {
		onRegisterClose();
		onLoginOpen();
	};

	const handleRegisterClick = () => {
		onLoginClose();
		onRegisterOpen();
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		setAuth({ user: null, token: null, isLoading: false });
		router.push('/');
	};

	return (
		<Box
			as='nav'
			bg='brand.dark.900'
			borderBottom='1px'
			borderColor='brand.dark.800'
			position='sticky'
			top={0}
			zIndex={1000}
			className='animate-slide-in'
		>
			<Container maxW='container.xl'>
				<Flex h={16} align='center'>
					<Flex flex={1} justify='flex-start'>
						<Flex
							align='center'
							gap={2}
							cursor='pointer'
							onMouseEnter={() => router.prefetch('/')}
							onClick={() => router.push('/')}
						>
							<Icon as={FiBook} boxSize={6} color='brand.primary.400' />
							<Text fontSize='xl' fontWeight='extrabold'>
								<Box as='span' color='brand.primary.400'>
									EVO
								</Box>
								GD
							</Text>
						</Flex>
					</Flex>

					<Flex flex={1} justify='center'>
						<HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
							{NAV_ITEMS.map((item) => (
								<Button
									key={item.label}
									variant='ghost'
									onMouseEnter={() => router.prefetch(item.href)}
									onClick={() => router.push(item.href)}
								>
									{item.label}
								</Button>
							))}
						</HStack>
					</Flex>

					<Flex flex={1} justify='flex-end'>
						<HStack spacing={4}>
							{auth.isLoading ? (
								<Spinner />
							) : auth.user ? (
								<Menu>
									<MenuButton
										as={Button}
										variant='ghost'
										leftIcon={<FiUser />}
										display={{ base: 'none', md: 'flex' }}
									>
										{auth.user.username}
									</MenuButton>
									<MenuList bg='brand.dark.800'>
										<MenuItem
											bg='brand.dark.800'
											_hover={{ bg: 'brand.dark.700' }}
											onClick={() => router.push('/profile')}
										>
											Perfil
										</MenuItem>
										<MenuItem
											bg='brand.dark.800'
											_hover={{ bg: 'brand.dark.700' }}
											onClick={onCreateOpen}
										>
											Crear Clase
										</MenuItem>
										<MenuItem
											bg='brand.dark.800'
											_hover={{ bg: 'brand.dark.700' }}
											onClick={onJoinOpen}
										>
											Unirse a Clase
										</MenuItem>
										<MenuItem
											bg='brand.dark.800'
											_hover={{ bg: 'brand.dark.700', color: 'red.400' }}
											color='red.500'
											onClick={handleLogout}
										>
											Cerrar Sesión
										</MenuItem>
									</MenuList>
								</Menu>
							) : (
								<>
									<Button
										display={{ base: 'none', md: 'flex' }}
										variant='outline'
										leftIcon={<FiLogIn />}
										onClick={onLoginOpen}
									>
										Iniciar Sesión
									</Button>
									<Button display={{ base: 'none', md: 'flex' }} onClick={onRegisterOpen}>
										Registrarse
									</Button>
								</>
							)}
							<IconButton
								display={{ base: 'flex', md: 'none' }}
								onClick={onMenuToggle}
								icon={<FiMenu />}
								variant='ghost'
								aria-label='Open menu'
							/>
						</HStack>
					</Flex>
				</Flex>
			</Container>
			<Box display={{ base: isMenuOpen ? 'block' : 'none', md: 'none' }} pb={4} bg='brand.dark.900'>
				<Stack spacing={4} px={4}>
					{NAV_ITEMS.map((item) => (
						<Button
							key={item.label}
							w='full'
							variant='ghost'
							onMouseEnter={() => router.prefetch(item.href)}
							onClick={() => router.push(item.href)}
						>
							{item.label}
						</Button>
					))}
					{auth.isLoading ? (
						<Spinner />
					) : auth.user ? (
						<>
							<Button
								w='full'
								leftIcon={<FiUser />}
								variant='outline'
								onMouseEnter={() => router.prefetch('/profile')}
								onClick={() => router.push('/profile')}
							>
								Mi Cuenta
							</Button>
							<Button w='full' colorScheme='red' onClick={handleLogout}>
								Cerrar Sesión
							</Button>
						</>
					) : (
						<>
							<Button w='full' leftIcon={<FiLogIn />} onClick={onLoginOpen}>
								Iniciar Sesión
							</Button>
							<Button w='full' onClick={onRegisterOpen}>
								Registrarse
							</Button>
						</>
					)}
				</Stack>
			</Box>

			<CreateClassModal isOpen={isCreateOpen} onClose={onCreateClose} />
			<JoinClassModal isOpen={isJoinOpen} onClose={onJoinClose} />
			<LoginModal isOpen={isLoginOpen} onClose={onLoginClose} onRegisterClick={handleRegisterClick} />
			<RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} onLoginClick={handleLoginClick} />
		</Box>
	);
}
