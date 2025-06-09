import million from 'million/compiler';
import nextBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: process.env.NEXT_OUTPUT,
	reactStrictMode: true,
	images: {
		remotePatterns: []
	},
	experimental: {
		optimizePackageImports: [
			'@chakra-ui/*',
			'@chakra-ui',
			'framer-motion',
			'react-dom',
			'react-icons/*'
		]
	},
	env: {
	},
};

const withBundleAnalyzer = nextBundleAnalyzer({
	enabled: false,
	openAnalyzer: true
});

let configExport = nextConfig;

if (process.env['NODE_ENV'] === 'production') {
	console.log('Loaded production config');
	configExport = million.next(nextConfig, { auto: true });
}

export default withBundleAnalyzer(configExport);
