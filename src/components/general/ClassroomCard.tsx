'use client';

import type { IClassroomCard } from '@/types/IClassroomCard';
import { Card, CardBody, Heading, Image, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function ClassroomCard({ item }: Readonly<{ item: IClassroomCard }>) {
	const router = useRouter();

	return (
		<Card maxW='sm' bg='#00000030' cursor='pointer' onClick={() => router.push(`/video/${item.id}`)}>
			<CardBody>
				<Image
					src={`https://cdn-evogd.tnfangel.com/thumbnails/thumbnail-${item.thumbnailId}.jpg`}
					alt={'Clase ' + item.name}
					borderRadius='lg'
					width='100%'
					height='200px'
					objectFit='cover'
				/>
				<Stack mt='5px'>
					<Heading size='md'>{item.name}</Heading>
				</Stack>
			</CardBody>
		</Card>
	);
}
