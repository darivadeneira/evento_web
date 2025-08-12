import type { DataProvider } from "react-admin";
import { apiAuth } from "../api/api";

export const transactionProvider: DataProvider = {
  getList: async (_resource, _params) => {
    try {
      // Obtener el ID del usuario desde localStorage
      const authData = localStorage.getItem('auth');
      if (!authData) {
        throw new Error('Usuario no autenticado');
      }
      
      const userData = JSON.parse(authData);
      const userId = userData.id;
      
      // Hacer petición a la API para obtener eventos del usuario
      const response = await apiAuth.get(`/transaction/events/${userId}`);
      
      return {
        data: response.data.map((transaction: any) => ({
          id: transaction.transactionId,
          ...transaction,
        })),
        total: response.data.length,
      };
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  },

  getOne: async (_resource, params) => {
    try {
      const authData = localStorage.getItem('auth');
      if (!authData) {
        throw new Error('Usuario no autenticado');
      }
      
      const userData = JSON.parse(authData);
      const userId = userData.id;
      
      const response = await apiAuth.get(`/transaction/events/${userId}`);
      const transaction = response.data.find((t: any) => t.transactionId === parseInt(params.id.toString()));
      
      if (!transaction) {
        throw new Error('Transacción no encontrada');
      }
      
      return {
        data: {
          id: transaction.transactionId,
          ...transaction,
        },
      };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  create: () => Promise.resolve({ data: { id: 0 } as any }),
  update: () => Promise.resolve({ data: { id: 0 } as any }),
  updateMany: () => Promise.resolve({ data: [] }),
  delete: () => Promise.resolve({ data: { id: 0 } as any }),
  deleteMany: () => Promise.resolve({ data: [] }),
};
