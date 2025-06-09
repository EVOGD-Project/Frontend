import { API_URL } from '@/constants/constants';
import type { IActivity } from '@/types/IActivity';
import type { IClassroom } from '@/types/IClassroomCard';
import type { IUser } from '@/types/IUser';

const getAuthHeaders = (): Record<string, string> => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
	return token ? { Authorization: token } : {};
};

export const api = {
	classroom: {
		getAll: async (): Promise<IClassroom[]> => {
			const res = await fetch(`${API_URL}/classrooms`, {
				headers: {
					...getAuthHeaders()
				}
			});

			if (!res.ok) throw new Error('Failed to fetch classrooms');
			return res.json();
		},

		getById: async (id: string): Promise<IClassroom> => {
			const res = await fetch(`${API_URL}/classrooms/${encodeURIComponent(id)}`, {
				headers: {
					...getAuthHeaders()
				}
			});

			if (!res.ok) throw new Error('Failed to fetch classroom');
			return res.json();
		},

		getMembers: async (id: string): Promise<IUser[]> => {
			const res = await fetch(`${API_URL}/classrooms/${encodeURIComponent(id)}/members`, {
				headers: {
					...getAuthHeaders()
				}
			});

			if (!res.ok) throw new Error('Failed to fetch classroom');
			return res.json();
		},


		create: async (data: {
			name: string;
			description: string;
			thumbnailId: number;
		}): Promise<{ id: string }> => {
			const res = await fetch(`${API_URL}/classrooms`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...getAuthHeaders()
				},
				body: JSON.stringify(data)
			});

			if (!res.ok) throw new Error('Failed to create classroom');
			return res.json();
		},

		update: async (
			id: string,
			data: {
				name: string;
				description: string;
				thumbnailId: number;
			}
		): Promise<{ id: string }> => {
			const res = await fetch(`${API_URL}/classrooms/${encodeURIComponent(id)}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					...getAuthHeaders()
				},
				body: JSON.stringify(data)
			});

			if (!res.ok) throw new Error('Failed to update classroom');
			return res.json();
		},

		join: async (code: string): Promise<IClassroom> => {
			const res = await fetch(`${API_URL}/classrooms/join/${encodeURIComponent(code)}`, {
				method: 'POST',
				headers: {
					...getAuthHeaders()
				}
			});

			if (!res.ok) throw new Error('Failed to join classroom');
			return res.json();
		}
	},

	activities: {
		getByClassroom: async (classroomId: string): Promise<IActivity[]> => {
			const res = await fetch(`${API_URL}/classrooms/${encodeURIComponent(classroomId)}/activities`, {
				headers: {
					...getAuthHeaders()
				}
			});

			if (!res.ok) throw new Error('Failed to fetch activities');
			return res.json();
		},

		getById: async (classroomId: string, activityId: string): Promise<IActivity> => {
			const res = await fetch(
				`${API_URL}/classrooms/${encodeURIComponent(classroomId)}/activities/${encodeURIComponent(activityId)}`,
				{
					headers: {
						...getAuthHeaders()
					}
				}
			);

			if (!res.ok) throw new Error('Failed to fetch activity');
			return res.json();
		},

		create: async (
			classroomId: string,
			data: {
				title: string;
				description: string;
				type: 'assignment' | 'material';
				dueDate?: string;
				content: {
					instructions?: string;
					resources?: Array<{
						type: 'link' | 'file';
						name: string;
						url: string;
					}>;
				};
			}
		): Promise<{ id: string }> => {
			const res = await fetch(`${API_URL}/classrooms/${encodeURIComponent(classroomId)}/activities`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...getAuthHeaders()
				},
				body: JSON.stringify(data)
			});

			if (!res.ok) throw new Error('Failed to create activity');
			return res.json();
		},

		update: async (
			classroomId: string,
			activityId: string,
			data: {
				title: string;
				description: string;
				type: 'assignment' | 'material';
				dueDate?: string;
				content: {
					instructions?: string;
					resources?: Array<{
						type: 'link' | 'file';
						name: string;
						url: string;
					}>;
				};
			}
		): Promise<IActivity> => {
			const res = await fetch(
				`${API_URL}/classrooms/${encodeURIComponent(classroomId)}/activities/${encodeURIComponent(activityId)}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						...getAuthHeaders()
					},
					body: JSON.stringify(data)
				}
			);

			if (!res.ok) throw new Error('Failed to update activity');
			return res.json();
		}
	}
};
