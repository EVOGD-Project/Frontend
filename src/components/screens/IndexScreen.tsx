import { Flex } from '@chakra-ui/react';
import Navbar from '../navigation/Navbar';

export default function IndexScreen() {
	return (
		<Flex w='100%' h='100%' gap='0px' direction='column'>
			<Navbar />
            
		</Flex>
	);
}
