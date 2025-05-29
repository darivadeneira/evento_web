import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import './App.css';
import { SignUpPage } from './components/auth/SignUp';
import { authProvider } from './providers/auth.provider';
import { customTheme } from './theme/customTheme';
import { LoginPage } from './components/auth/LoginPage';
import Dashboard from './components/Dashboard';
import CustomLayout from './components/layout/Layout';
import mainProvider from './providers/main.provider';
import { EventList } from './components/events/EventList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/*" element={
          <Admin
            authProvider={authProvider}
            dataProvider={mainProvider}
            dashboard={Dashboard}
            theme={customTheme}
            layout={CustomLayout}
            loginPage={LoginPage}
            disableTelemetry
          >
            <Resource 
              name="event-entity" 
              list={EventList}
            />
          </Admin>
        } />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
