export interface ISubmission {
	id: string;
	activity: string;
	user: string;
	comment: string;
	files: Array<{
		name: string;
		url: string;
	}>;
	submittedAt: string;
}
