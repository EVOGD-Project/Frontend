'use client';

import type { IClassroomCard } from '@/types/IClassroomCard';
import { Box, Button, Card, CardBody, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiUsers } from 'react-icons/fi';

export default function ClassroomCard({ item }: Readonly<{ item: IClassroomCard }>) {
	const router = useRouter();

	return (
		<Card maxW='100%' onClick={() => router.push(`/classes/${item.id}`)} className='animate-fade-in'>
			<Box position='relative' overflow='hidden'>
				<Image
					src={`https://evogd-cdn.tnfangel.com/thumbnails/thumbnail-${item.thumbnailId}.jpg`}
					alt={'Clase ' + item.name}
					width='100%'
					height='100px'
					objectFit='cover'
					objectPosition='right'
					transition='transform 0.3s ease'
					_groupHover={{ transform: 'scale(1.05)' }}
				/>
				<Box
					position='absolute'
					bottom={0}
					left={0}
					right={0}
					height='30%'
					bgGradient='linear(to-t, brand.dark.900 10%, transparent)'
				/>
			</Box>

			<CardBody>
				<Stack spacing={4}>
					<Heading
						size='md'
						noOfLines={2}
						transition='color 0.3s ease'
						_groupHover={{ color: 'brand.primary.400' }}
					>
						{item.name}
					</Heading>
					<Text fontSize='sm' noOfLines={2}>
						{item.description || 'Sin descripción.'}
					</Text>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<FiUsers />
							<Text fontSize='sm'>24 estudiantes</Text>
						</Flex>
						<Button
							size='sm'
							_groupHover={{
								bg: 'brand.primary.500',
								color: 'white'
							}}
						>
							Entrar
						</Button>
					</Flex>
				</Stack>
			</CardBody>
		</Card>
	);
}
