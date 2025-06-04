'use client';

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { Provider as JotaiProvider } from 'jotai';
const theme = extendTheme({
	config: {
		initialColorMode: 'dark',
		useSystemColorMode: false
	}
});

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
				<style>{`@keyframes slideFadeIn{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@keyframes scaleFadeIn{0%{opacity:0;transform:scale(.95)}100%{opacity:1;transform:scale(1)}}@keyframes textShine{0%{background-position:0 50%}100%{background-position:100% 50%}}::-webkit-scrollbar{width:6px;z-index:100000}::-webkit-scrollbar-track{border-radius:10px;background-color:#00000030}::-webkit-scrollbar-thumb{border-radius:10px;background-color:#00000050}::-webkit-scrollbar-thumb:hover{background-color:#00000060}.cf-turnstile div{display:flex;}`}</style>
			</head>
			<body
				style={{
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					color: '#FFFFFF'
				}}
			>
				<ColorModeScript initialColorMode={theme['config'].initialColorMode} />
				<ChakraProvider theme={theme}>
					<JotaiProvider>{children}</JotaiProvider>
				</ChakraProvider>
			</body>
		</html>
	);
}
