'use client';

import ActivityScreen from '@/components/screens/ActivityScreen';
import { useParams } from 'next/navigation';

export default function ActivityPage() {
	const { id, activityId } = useParams<{ id: string; activityId: string }>();
	return <ActivityScreen classroomId={id} activityId={activityId} />;
}
