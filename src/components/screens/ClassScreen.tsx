'use client';

import { Text } from '@chakra-ui/react';

export default function ClassScreen({ id }: Readonly<{ id: string }>) {
	return (
		<Text fontSize='lg' color='gray.400'>
			ID de clase: {id}
		</Text>
	);
}
