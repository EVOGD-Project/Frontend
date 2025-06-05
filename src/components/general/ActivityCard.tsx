'use client';

import type { IActivity } from '@/types/IActivity';
import { Badge, Box, Card, CardBody, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiCalendar, FiFileText } from 'react-icons/fi';

const activityTypeInfo = {
	assignment: {
		label: 'Tarea',
		color: 'blue'
	},
	material: {
		label: 'Material',
		color: 'green'
	}
} as const;

export default function ActivityCard({ activity, onClick }: Readonly<{ activity: IActivity; onClick?: () => void }>) {
	return (
		<Card maxW='100%' onClick={onClick} cursor='pointer'>
			<CardBody>
				<Stack spacing={4}>
					<Flex gap={2} align='center'>
						<Badge colorScheme={activityTypeInfo[activity.type].color} px={2} py={1} borderRadius='md'>
							{activityTypeInfo[activity.type].label}
						</Badge>
						{activity.dueDate && (
							<Text fontSize='sm' color='gray.400'>
								Para el{' '}
								{format(new Date(activity.dueDate), "d 'de' MMMM", {
									locale: es
								})}
							</Text>
						)}
					</Flex>

					<Box>
						<Heading
							size='md'
							noOfLines={2}
							transition='color 0.3s ease'
							_groupHover={{ color: 'brand.primary.400' }}
							mb={2}
						>
							{activity.title}
						</Heading>
						<Text fontSize='sm' noOfLines={2} color='gray.400'>
							{activity.description}
						</Text>
					</Box>

					<Flex justify='space-between' align='center'>
						{activity.createdAt && (
							<Flex align='center' gap={2} color='gray.400' fontSize='sm'>
								<FiCalendar />
								<Text>
									Creado el{' '}
									{format(new Date(activity.createdAt), "d 'de' MMMM", {
										locale: es
									})}
								</Text>
							</Flex>
						)}
						{(activity.content.resources?.length || 0) > 0 && (
							<Flex align='center' gap={2} color='gray.400' fontSize='sm'>
								<FiFileText />
								<Text>
									{activity.content.resources?.length || 0} recurso
									{activity.content.resources?.length !== 1 ? 's' : ''}
								</Text>
							</Flex>
						)}
					</Flex>
				</Stack>
			</CardBody>
		</Card>
	);
}
