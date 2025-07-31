import type { DataProvider, GetListParams, GetOneParams } from "react-admin";
import { apiAuth } from "../api/api";

export const ticketCategoryProvider: DataProvider = {
    getList: async (resource, params: GetListParams) => {
        console.log("resource", resource, "params", params);
        const { pagination, sort, filter } = params;
        const response = await apiAuth.post(`/${resource}/paginated`, {
            page: pagination?.page,
            rowsPage: pagination?.perPage,
            filter: filter,
            order: sort?.order
        });
        const { data, count } = response.data;
        return { data: data, total: count };
    },
    getOne: async (resource, params: GetOneParams) => {
        try {
            const response = await apiAuth.get(`/${resource}/${params.id}`);
            return { data: response.data };
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
            const response = await apiAuth.post(`/${resource}/multiple`, params.data);
            return { data: response.data };
        } catch (error) {
            return Promise.reject(error);
        }
    },
    update: async (resource, params) => {
        try {
            const response = await apiAuth.put(`/${resource}/${params.id}`, params.data);
            return { data: response.data };
        } catch (error) {
            return Promise.reject(error);
        }
    },
    updateMany: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    delete: async (resource, params) => {
        try {
            await apiAuth.delete(`/${resource}/${params.id}`);
            return { data: params.previousData! };
        } catch (error) {
            return Promise.reject(error);
        }
    },
    deleteMany: async () => {
        return Promise.reject(new Error("Not implemented"));
    }
};
