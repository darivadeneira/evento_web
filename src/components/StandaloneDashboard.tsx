import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Dashboard from './Dashboard';
import { customTheme } from '../theme/customTheme';

/**
 * Componente contenedor para mostrar el Dashboard fuera del contexto de react-admin
 */
export const StandaloneDashboard = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Dashboard />
      </Box>
    </ThemeProvider>
  );
};

export default StandaloneDashboard;
