'use client';

import ClassroomScreen from '@/components/screens/ClassroomScreen';
import { useParams } from 'next/navigation';

export default function ClassPage() {
	const { id } = useParams<{ id: string }>();
	return <ClassroomScreen id={id} />;
}
