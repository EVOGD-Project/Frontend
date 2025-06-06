'use client';

import Navbar from '@/components/navigation/Navbar';
import AuthProvider from '@/components/providers/AuthProvider';
import { theme } from '@/theme/theme';
import { ChakraProvider, ColorModeScript, Flex } from '@chakra-ui/react';
import { Provider as JotaiProvider } from 'jotai';

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden'
			}}
			suppressHydrationWarning
		>
			<head>
				<meta name='viewport' content='initial-scale=1, width=device-width' />
				<meta name='title' content='EVOGD' />
				<meta name='keywords' content='evogd' />
				<meta name='author' content='tnfAngel' />
				<style>{`
					@keyframes gradientText {
						0% { background-position: 0% 50%; }
						50% { background-position: 100% 50%; }
						100% { background-position: 0% 50%; }
					}
					@keyframes fadeIn {
						from { opacity: 0; transform: translateY(10px); }
						to { opacity: 1; transform: translateY(0); }
					}
					@keyframes slideIn {
						from { transform: translateX(-20px); opacity: 0; }
						to { transform: translateX(0); opacity: 1; }
					}
					.animate-fade-in {
						animation: fadeIn 0.3s ease-out forwards;
					}
					.animate-slide-in {
						animation: slideIn 0.3s ease-out forwards;
					}
					::-webkit-scrollbar {
						width: 8px;
						height: 8px;
					}
					::-webkit-scrollbar-track {
						background: #1a1a1a;
						border-radius: 4px;
					}
					::-webkit-scrollbar-thumb {
						background: #333;
						border-radius: 4px;
						transition: all 0.2s ease;
					}
					::-webkit-scrollbar-thumb:hover {
						background: #444;
					}
				`}</style>
			</head>
			<body
				style={{
					width: '100%',
					height: '100%',
					overflow: 'hidden'
				}}
			>
				<ColorModeScript initialColorMode={theme['config'].initialColorMode} />
				<ChakraProvider theme={theme}>
					<JotaiProvider>
						<AuthProvider>
							<Flex w='100%' h='100%' direction='column'>
								<Navbar />
								<Flex flex='1' overflowY='auto' direction='column' align='stretch'>
									{children}
								</Flex>
							</Flex>
						</AuthProvider>
					</JotaiProvider>
				</ChakraProvider>
			</body>
		</html>
	);
}
