export interface IClassroomCard {
	id: string;
	name: string;
	description: string;
	thumbnailId: number;
	code: string;
	owner: {
		id: string;
		name: string;
		avatar?: string;
	};
}
