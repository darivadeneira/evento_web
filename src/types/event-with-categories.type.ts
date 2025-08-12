export interface IEventCategory {
  id: number;
  name: string;
  description: string;
}

export interface IEventWithCategories {
  id: number;
  name: string;
  date: string; // En frontend usamos string para las fechas
  hour: string;
  latitude: number;
  longitude: number;
  city: string;
  description: string;
  capacity: number;
  state: string;
  userId: number;
  categories: IEventCategory[];
}
