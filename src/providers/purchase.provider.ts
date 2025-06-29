import type { DataProvider } from "react-admin";
import { apiAuth } from "../api/api";

export const purchaseProvider: DataProvider = {
    getList: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    getOne: async () => {
        return Promise.reject(new Error("Not implemented"));
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
    update: async () => {
        return Promise.reject(new Error("Not implemented"));
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
