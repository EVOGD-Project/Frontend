'use client';

import { authAtom, loadUser } from '@/store/auth';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [auth, setAuth] = useAtom(authAtom);

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
	}, [auth.token, setAuth]);

	return <>{children}</>;
}
