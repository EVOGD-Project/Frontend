'use client';

import ClassScreen from '@/components/screens/ClassScreen';
import { useParams } from 'next/navigation';

export default function ClassPage() {
	const { id } = useParams<{ id: string }>();
	return <ClassScreen id={id} />;
}
