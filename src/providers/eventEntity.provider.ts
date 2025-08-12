import type { DataProvider, GetListParams, GetOneParams } from "react-admin";
import { apiAuth } from "../api/api";

export const eventEntityProvider: DataProvider = {
    getList: async (resource, params: GetListParams) => {
        console.log("resource", resource, "params", params);
        const { pagination, sort, filter } = params;
        
        try {
            // Intentar usar el endpoint con categorías para el listado paginado
            const response = await apiAuth.post(`/${resource}/paginated`, {
                page: pagination?.page,
                rowsPage: pagination?.perPage,
                filter: filter,
                order: sort?.order
            });
            const {data, count} = response.data;
            return {data: data, total: count};
        } catch (error) {
            console.error("Error al obtener eventos paginados:", error);
            return Promise.reject(error);
        }
    },
    
    // Nuevo método para obtener eventos con categorías
    getListWithCategories: async (resource: string) => {
        try {
            const response = await apiAuth.get(`/${resource}/with-categories`);
            return { data: response.data };
        } catch (error) {
            return Promise.reject(error);
        }
    },    
    getOne: async (resource, params: GetOneParams) => {
        try {
            console.log("resource", resource, "params", params);
            // Usar el endpoint con categorías
            const eventResponse = await apiAuth.get(`/${resource}/${params.id}/with-categories`);
            
            // También obtener categorías de tickets para este evento (para crear tickets)
            const ticketCategoriesResponse = await apiAuth.get(`/ticket-category/event/${params.id}`);
            
            // Combinar datos del evento con categorías de tickets
            return { 
                data: {
                    ...eventResponse.data,
                    ticketCategories: ticketCategoriesResponse.data || [] 
                }
            };
        } catch (error) {
            // Fallback al endpoint normal si el de categorías falla
            try {
                const eventResponse = await apiAuth.get(`/${resource}/${params.id}`);
                const ticketCategoriesResponse = await apiAuth.get(`/ticket-category/event/${params.id}`);
                return { 
                    data: {
                        ...eventResponse.data,
                        ticketCategories: ticketCategoriesResponse.data || [] 
                    }
                };
            } catch (fallbackError) {
                return Promise.reject(fallbackError);
            }
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