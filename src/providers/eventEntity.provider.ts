import type { DataProvider, GetListParams } from "react-admin";
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
    getOne: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    getMany: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    getManyReference: async () => {
        return Promise.reject(new Error("Not implemented"));
    },
    create: async () => {
        return Promise.reject(new Error("Not implemented"));
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