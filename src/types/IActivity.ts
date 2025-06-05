export interface IActivity {
	id: string;
	title: string;
	description: string;
	classroomId: string;
	dueDate?: string;
	createdAt: string;
	type: 'assignment' | 'material';
	content: {
		instructions?: string;
		resources?: Array<{
			type: 'link' | 'file';
			name: string;
			url: string;
		}>;
	};
}
