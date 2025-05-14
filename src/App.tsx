import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import './App.css';
import { SignUpPage } from './components/SignUp';
import { authProvider } from './providers/auth.provider';
import { customTheme } from './theme/customTheme';
import { LoginPage } from './components/LoginPage';
import Dashboard from './components/Dashboard';
import StandaloneDashboard from './components/StandaloneDashboard';

// Modificación temporal para desarrollo - NO USAR EN PRODUCCIÓN
const bypassAuthProvider = {
  ...authProvider,
  checkAuth: () => Promise.resolve()
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección de la ruta raíz al dashboard */}
        <Route path="/" element={<Navigate to="/preview-dashboard" replace />} />
        
        {/* Página de registro SIN react-admin */}
        <Route path="/auth/signup" element={<SignUpPage />} />
        
        {/* Ruta directa al Dashboard (solo para desarrollo) */}
        <Route path="/preview-dashboard" element={<StandaloneDashboard />} />

        {/* Resto de la app con react-admin */}
        <Route
          path="/*"
          element={
            <Admin
              authProvider={bypassAuthProvider}
              theme={customTheme}
              loginPage={LoginPage}
              dashboard={Dashboard}
              disableTelemetry
            >
              {/* tus recursos aquí */}
            </Admin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
