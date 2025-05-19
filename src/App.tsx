import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Admin, CustomRoutes } from 'react-admin';
import './App.css';
import { SignUpPage } from './components/auth/SignUp';
import { authProvider } from './providers/auth.provider';
import { customTheme } from './theme/customTheme';
import { LoginPage } from './components/auth/LoginPage';
import StandaloneDashboard from './components/StandaloneDashboard';

function isAuthenticated() {
  try {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    return !!auth.token;
  } catch {
    return false;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? (
              <StandaloneDashboard />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />
        <Route
          path="/*"
          element={
            <Admin
              authProvider={authProvider}
              theme={customTheme}
              loginPage={LoginPage}
              disableTelemetry
            >
              {/* Rutas personalizadas dentro de Admin */}
              <CustomRoutes noLayout>
                <Route
                  path="/auth/signup"
                  element={<SignUpPage />}
                />

                <Route
                  path="/dashboard"
                  element={
                    isAuthenticated() ? (
                      <StandaloneDashboard />
                    ) : (
                      <Navigate
                        to="/login"
                        replace
                      />
                    )
                  }
                />
              </CustomRoutes>
            </Admin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
