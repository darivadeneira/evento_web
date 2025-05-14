import type { AuthProvider } from "react-admin";
import { Login, SignUp } from "../api/cliente";

export const authProvider: AuthProvider = {
  signup: async (userData) => {
    try {
      const response = await SignUp("/auth/signup", userData, true);
      // Si la respuesta es 201, retorna status y mensaje
      if (response && response.status === 201) {
        return { status: 201, message: response.data?.message || "Cuenta creada con éxito" };
      }
      // Si no es 201, retorna el mensaje de error del backend
      return { status: response.status, message: response.data?.message || "Error al crear la cuenta" };
    } catch (error: any) {
      // Si axios lanza error, intenta extraer el mensaje del backend
      const status = error?.response?.status || 500;
      const message = error?.response?.data?.message || error.message || "Error al crear la cuenta";
      return { status, message };
    }
  },
  
  login: async ({ username, password }) => {
    try {
      const response = await Login("/auth/login", { username, password });
      
      if (response && response.access_token && response.user) {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            token: response.access_token,
            ...response.user, 
          }),
        );
        
        if (response?.user?.forcePasswordchange === true) {
          window.location.href = "/auth/change-password";
          return Promise.resolve();
        }
        return Promise.resolve();
      }
      return Promise.reject(new Error("No se recibió el token de acceso"));
    } catch (error) {
      console.error("Error durante el login:", error);
      return Promise.reject(new Error("Falló la autenticación"));
    }
  },


  logout: () => {
    localStorage.removeItem("auth");
    //eliminar todas las claves de caché relacionadas con la paginación
    const prefix = "paginatedCache:";
    for (const key in localStorage) {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
    return Promise.resolve();
  },
  

  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: async () => {
    const auth = JSON.parse(localStorage.getItem("auth")|| "{}");
    if (auth.token) {
      return Promise.resolve();
    }
    return Promise.reject();
  },

  getPermissions: () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { roles } = JSON.parse(auth);
      return Promise.resolve(roles);
    }
    return Promise.reject();
  },

  getIdentity: () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const user = JSON.parse(auth);
      return Promise.resolve(user);
    }
    return Promise.reject();
  },
};
