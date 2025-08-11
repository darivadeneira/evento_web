import type { DataProvider, GetListParams, GetOneParams } from "react-admin";
import { apiAuth } from "../api/api";

export const eventEntityProvider: DataProvider = {
    getList: async (resource, params: GetListParams) => {
        console.log("resource", resource, "params", params);
        const { pagination, sort, filter } = params;
        const response = await apiAuth.post(`/${resource}/paginated`, {
            page: pagination?.page,
            rowsPage: pagination?.perPage,
            filter: filter,
            order: sort?.order
        })
        const {data,count} = response.data;
        return {data: data, total: count}
    },    
    getOne: async (resource, params: GetOneParams) => {
        try {
            console.log("resource", resource, "params", params);
            const eventResponse = await apiAuth.get(`/${resource}/${params.id}`);
            // Obtener categorías de tickets para este evento
            const ticketCategoriesResponse = await apiAuth.get(`/ticket-category/event/${params.id}`);
            
            // Combinar datos del evento con categorías de tickets
            return { 
                data: {
                    ...eventResponse.data,
                    ticketCategories: ticketCategoriesResponse.data || [] 
                }
            };
        } catch (error) {
            return Promise.reject(error);
        }
    },
    getMany: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    getManyReference: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    create: async (resource, params) => {
        try {
            const response = await apiAuth.post(`/${resource}`, params.data);
            return { data: response.data };
        } catch (error) {
            return Promise.reject(error);
        }
    },
    update: async (resource, params) => {
        try {
            const response = await apiAuth.patch(`/${resource}/${params.id}`, params.data);
            return { data: response.data };
        } catch (error) {
            return Promise.reject(error);
        }
    },
    updateMany: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    delete: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    deleteMany: async () => {
        return Promise.reject(new Error("Not implemented"));
    }
}