import type { IUser } from '@/types/IUser';
import { atom } from 'jotai';

interface AuthState {
    user: IUser | null;
    token: string | null;
    isLoading: boolean;
}

export const authAtom = atom<AuthState>({
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isLoading: true
});

export const loadUser = async (token: string): Promise<IUser | null> => {
    try {
        const res = await fetch('https://evogd-api.tnfangel.com/user', {
            headers: {
                Authorization: token
            }
        });

        if (!res.ok) {
            localStorage.removeItem('token');
            return null;
        }

        const data = await res.json();
        return data;
    } catch {
        localStorage.removeItem('token');
        return null;
    }
}; 