'use client';

import { api } from '@/api/api';
import { authAtom, loadUser } from '@/store/auth';
import { classroomsAtom } from '@/store/classrooms';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [auth, setAuth] = useAtom(authAtom);
	const [, setClassrooms] = useAtom(classroomsAtom);

	useEffect(() => {
		const initAuth = async () => {
			if (!auth.token) {
				setAuth((prev) => ({ ...prev, isLoading: false }));
				return;
			}

			const user = await loadUser(auth.token);
			setAuth((prev) => ({ ...prev, user, isLoading: false }));
		};

		initAuth();

		const fetchClassrooms = async () => {
			try {
				const data = await api.classroom.getAll();
				setClassrooms(data);
			} catch (error) {
				console.error('Failed to fetch classrooms:', error);
				setClassrooms([]);
			}
		};

		fetchClassrooms();
	}, [auth.token, setAuth, setClassrooms]);

	return <>{children}</>;
}
