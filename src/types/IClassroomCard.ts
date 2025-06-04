export interface IClassroomCard {
    id: string;
    name: string;
    thumbnailId?: number;
    owner: {
        id: string;
        name: string;
        avatar?: string;
    };
}