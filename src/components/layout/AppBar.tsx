import {
  Box,
  useMediaQuery,
  Avatar,
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AppBar as RaAppBar,
  useGetIdentity,
} from "react-admin";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import CustomUserMenu from "./CustomUserMenu";

const AvatarComponent = ({ name, lastname }: { name: string; lastname: string }) => {
  const initials = `${name?.charAt(0).toUpperCase()}${lastname?.charAt(0).toUpperCase()}`;

  return (
    <Avatar
      sx={{
        bgcolor: "primary.main",
        fontSize: "1rem", // Reduce el tamaño de las iniciales
        cursor: "pointer", // Añade cursor pointer
        "&:hover": {
          bgcolor: "primary.dark", // Cambia el color de fondo al hacer hover
        },
      }}
    >
      {initials}
    </Avatar>
  );
};

const UserMenuTrigger = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: identity, isLoading } = useGetIdentity();

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
        onClick={handleMenuOpen}
      >
        <AvatarComponent name={identity?.name || ""} lastname={identity?.lastname || ""} />
        {!isLoading && identity && `${identity.name} ${identity.lastname}`}
      </div>
      <CustomUserMenu 
        open={menuOpen}
        onClose={handleMenuClose}
        name={identity?.name || ""}
        lastname={identity?.lastname || ""}
      />
    </>
  );
};

const AppBarComponent = (props: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <RaAppBar
      {...props}
      color="primary"
      elevation={1}
      userMenu={<UserMenuTrigger />}
      toggleSidebar={null}
      sx={{
        color: theme.palette.text.primary,
        padding: "5px 10px",
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
            src="/Images/Logo.png"
            alt="Logo"
            style={{
              height: "40px",
              marginRight: "16px",
            }}
          />
          {!isMobile && (
            <Box
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: theme.palette.text.primary,
                cursor: 'pointer',
                '&:hover': { color: theme.palette.primary.main },
              }}
              onClick={() => { window.location.href = '/'; }}
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
                "&:hover": {
                  backgroundColor: "rgba(74, 255, 117, 0.08)",
                },
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
                "&:hover": {
                  backgroundColor: "rgba(74, 255, 117, 0.08)",
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </RaAppBar>
  );
};

export default AppBarComponent;
