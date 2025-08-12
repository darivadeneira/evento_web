import type { DataProvider, GetListParams, GetListResult } from 'react-admin';
import { apiAuth } from '../api/api';

export interface IEventCategory {
  id: number;
  name: string;
  description: string;
}

export const eventCategoryProvider: DataProvider = {
  getList: async (): Promise<GetListResult<IEventCategory>> => {
    try {
      const response = await apiAuth.get('/event-category');
      
      return {
        data: response.data || [],
        total: response.data?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching event categories:', error);
      throw error;
    }
  },

  getOne: async (resource: string, params: any) => {
    const response = await apiAuth.get(`/event-category/${params.id}`);
    return { data: response.data };
  },

  getMany: async (resource: string, params: any) => {
    const response = await apiAuth.get('/event-category', {
      params: { ids: params.ids }
    });
    return { data: response.data || [] };
  },

  create: async (resource: string, params: any) => {
    const response = await apiAuth.post('/event-category', params.data);
    return { data: response.data };
  },

  update: async (resource: string, params: any) => {
    const response = await apiAuth.put(`/event-category/${params.id}`, params.data);
    return { data: response.data };
  },

  delete: async (resource: string, params: any) => {
    await apiAuth.delete(`/event-category/${params.id}`);
    return { data: params.previousData };
  },

  deleteMany: async (resource: string, params: any) => {
    await Promise.all(params.ids.map((id: any) => apiAuth.delete(`/event-category/${id}`)));
    return { data: params.ids };
  },

  updateMany: async (resource: string, params: any) => {
    const responses = await Promise.all(
      params.ids.map((id: any) =>
        apiAuth.put(`/event-category/${id}`, params.data)
      )
    );
    return { data: responses.map(response => response.data) };
  },

  getManyReference: async (resource: string, params: any) => {
    const response = await apiAuth.get('/event-category', {
      params: {
        ...params.filter,
        [params.target]: params.id,
      }
    });
    return {
      data: response.data || [],
      total: response.data?.length || 0,
    };
  },
};
