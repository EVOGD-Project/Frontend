import { SimpleGrid } from '@chakra-ui/react';
import { classrooms } from '../mocks/classrooms';
import ClassroomCard from '../general/ClassroomCard';

export default function IndexScreen() {
	return (
		<SimpleGrid w='100' padding='20px' spacing='20px' minChildWidth='100px'>
			{classrooms.map((c) => (
				<ClassroomCard item={c} key={c.id} />
			))}
		</SimpleGrid>
	);
}
