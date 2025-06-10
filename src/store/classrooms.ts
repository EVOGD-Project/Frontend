import type { IClassroom } from '@/types/IClassroomCard';
import { atom } from 'jotai';

export const classroomsAtom = atom<IClassroom[] | null>(null);
