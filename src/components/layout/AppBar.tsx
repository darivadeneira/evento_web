import { Box, Button, useMediaQuery, Avatar, IconButton, Badge, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AppBar as RaAppBar, UserMenu, Logout, useGetIdentity } from "react-admin";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

const CustomUserMenu = () => {
  const { data: identity } = useGetIdentity();
  const userName = identity?.fullName || 'Usuario';

  return (
    <UserMenu>
      <Logout />
    </UserMenu>
  );
};

const AppBarComponent = (props: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: identity } = useGetIdentity();

  return (
    <RaAppBar
      {...props}
      color="primary"
      elevation={1}
      userMenu={<CustomUserMenu />}
      toggleSidebar={null}
      sx={{
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo y nombre de la empresa */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              height: "40px",
              marginRight: "16px",
              filter: 'brightness(0) invert(1)',
            }}
          />
          {!isMobile && (
            <Box
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              EPAA
            </Box>
          )}
        </Box>

        {/* Iconos de la derecha */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Notificaciones">
            <IconButton 
              size="small"
              sx={{ 
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(74, 255, 117, 0.08)',
                }
              }}
            >
              <Badge badgeContent={3} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Configuración">
            <IconButton 
              size="small"
              sx={{ 
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(74, 255, 117, 0.08)',
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* El UserMenu se renderizará automáticamente aquí */}
        </Box>
      </Box>
    </RaAppBar>
  );
};

export default AppBarComponent;
