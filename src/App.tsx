import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import './App.css';
import { SignUpPage } from './components/auth/SignUp';
import { authProvider } from './providers/auth.provider';
import { LoginPage } from './components/auth/LoginPage';
import Dashboard from './components/Dashboard';
import CustomLayout from './components/layout/Layout';
import mainProvider from './providers/main.provider';
import { EventList } from './components/events/EventList';
import { darkNeonTheme } from './theme/darkNeonTheme';
import OrganizerEvents from './components/events/OrganizerEvents';
import EventDetails from './components/events/information/EventDetails';
import PurchasedEvents from './components/events/PurchasedEvents';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth/signup"
          element={<SignUpPage />}
        />{' '}
        <Route
          path="/*"
          element={
            <Admin
              authProvider={authProvider}
              dataProvider={mainProvider}
              dashboard={Dashboard}
              theme={darkNeonTheme}
              layout={CustomLayout}
              loginPage={LoginPage}
              disableTelemetry
            >
              <Resource
                name="event-entity"
                list={EventList}
                show={EventDetails}
              />
              <CustomRoutes>
                <Route
                  path="/organizer-events"
                  element={<OrganizerEvents />}
                />
                <Route
                  path="/mis-eventos-comprados"
                  element={<PurchasedEvents />}
                />
                <Route
                  path="/evento/:id"
                  element={<EventDetails />}
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
