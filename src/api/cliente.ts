import { apiAuth } from './api';

export const Login = async (resource: string, data: any) => {
  try {
    const response = await apiAuth.post(resource, data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const SignUp = async (resource: string, data: any, raw?: boolean) => {
  try {
    const response = await apiAuth.post(resource, data);
    if (raw) return response;
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};
