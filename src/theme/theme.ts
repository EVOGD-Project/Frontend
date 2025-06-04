import { extendTheme } from '@chakra-ui/react';

const colors = {
	brand: {
		primary: {
			50: '#E5F4FF',
			100: '#B8E1FF',
			200: '#8ACDFF',
			300: '#5CB9FF',
			400: '#2EA5FF',
			500: '#0091FF',
			600: '#0074CC',
			700: '#005799',
			800: '#003A66',
			900: '#001D33'
		},
		secondary: {
			50: '#F2E6FF',
			100: '#D9B8FF',
			200: '#C08AFF',
			300: '#A75CFF',
			400: '#8E2EFF',
			500: '#7500FF',
			600: '#5E00CC',
			700: '#460099',
			800: '#2F0066',
			900: '#170033'
		},
		dark: {
			50: '#F5F5F5',
			100: '#E6E6E6',
			200: '#CCCCCC',
			300: '#B3B3B3',
			400: '#999999',
			500: '#808080',
			600: '#666666',
			700: '#4D4D4D',
			800: '#333333',
			900: '#1A1A1A',
			950: '#0D0D0D'
		}
	}
};

const components = {
	Card: {
		baseStyle: {
			container: {
				backgroundColor: 'brand.dark.900',
				borderRadius: 'xl',
				overflow: 'hidden',
				transition: 'all 0.3s ease',
				border: '1px solid transparent',
				_hover: {
					transform: 'translateY(-4px)',
					boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
					borderColor: 'brand.dark.800'
				}
			}
		}
	},
	Heading: {
		baseStyle: {
			color: 'white'
		}
	},
	Text: {
		baseStyle: {
			color: 'gray.300'
		}
	}
};

const styles = {
	global: {
		body: {
			bg: 'brand.dark.950',
			color: 'gray.100'
		}
	}
};

const config = {
	initialColorMode: 'dark',
	useSystemColorMode: false
};

export const theme = extendTheme({
	colors,
	components,
	styles,
	config
});
