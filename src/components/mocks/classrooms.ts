import type { IClassroomCard } from '@/types/IClassroomCard';

export const classrooms: IClassroomCard[] = [
	{
		id: '1',
		name: 'Clase de prueba',
		thumbnailId: 1,
		owner: {
			id: '1',
			name: 'Ángel',
			avatar: 'https://avatars.githubusercontent.com/u/57068341?v=4'
		}
	},
	{
		id: '2',
		name: 'Clase de prueba 2',
		thumbnailId: 2,
		owner: {
			id: '1',
			name: 'Ángel',
			avatar: 'https://avatars.githubusercontent.com/u/57068341?v=4'
		}
	}
];
