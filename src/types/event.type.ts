export interface IEventCategory {
    id: number;
    name: string;
    description: string;
}

export interface ICategoryManage {
    id: number;
    idEventCategory: number;
    idEventEntity: number;
    eventCategory: IEventCategory;
}

export interface IEvent {
    id: number;
    name: string;
    description: string;
    date: string;
    hour: string;
    location: string;
    city: string;
    capacity: number;
    state: string;
    userId?: number;
    categoryManages?: ICategoryManage[];
}