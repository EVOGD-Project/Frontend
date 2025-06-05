import type { IActivity } from '@/types/IActivity';

export const activities: IActivity[] = [
	{
		id: '1',
		title: 'Tarea de ejemplo 1',
		description: 'Esta es una tarea de ejemplo para mostrar la funcionalidad',
		classroomId: '1',
		createdAt: new Date().toISOString(),
		type: 'assignment',
		dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		content: {
			instructions: `# Prueba

1. Esto es una prueba
2. Esto es una prueba

## Prueba 2

1. Esto es una prueba
2. Esto es una prueba

### Prueba 3

- Esto es una prueba
- Esto es una prueba`,
			resources: [
				{
					type: 'file',
					name: 'Material de lectura',
					url: 'https://cdn.tnfangel.com/files/spongebob.mp4'
				},
				{
					type: 'link',
					name: 'Recurso adicional',
					url: 'https://www.tnfangel.com'
				}
			]
		}
	},
	{
		id: '2',
		title: 'Material de clase',
		description: 'Material de apoyo para la clase',
		classroomId: '1',
		createdAt: new Date().toISOString(),
		type: 'material',
		content: {
			instructions: `# Prueba material

material de prueba

## prueba 2

1. prueba
2. prueba

## prueba 2

prueba.`,
			resources: [
				{
					type: 'file',
					name: 'Material de lectura',
					url: 'https://cdn.tnfangel.com/files/spongebob.mp4'
				},
				{
					type: 'link',
					name: 'Recurso adicional',
					url: 'https://www.tnfangel.com'
				},
				{
					type: 'file',
					name: 'Material de lectura',
					url: 'https://cdn.tnfangel.com/files/spongebob.mp4'
				}
			]
		}
	}
];
