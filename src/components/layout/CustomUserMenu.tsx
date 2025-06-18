import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGetIdentity, useLogout } from "react-admin";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PaletteIcon from "@mui/icons-material/Palette";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

interface CustomUserMenuProps {
  open: boolean;
  onClose: () => void;
  name: string;
  lastname: string;
}

const CustomUserMenu = ({ open, onClose, name, lastname }: CustomUserMenuProps) => {
  const theme = useTheme();
  const { data: identity } = useGetIdentity();
  const initials = `${name?.charAt(0).toUpperCase()}${lastname?.charAt(0).toUpperCase()}`;
  const logout = useLogout();
  const navigate = useNavigate();

  const menuItems = [
    // {
    //   text: "Mi Perfil",
    //   icon: <AccountCircleIcon />,
    //   action: () => {
    //     console.log("Ver perfil");
    //     onClose();
    //   },
    // },
    // {
    //   text: "Configuración",
    //   icon: <SettingsIcon />,
    //   action: () => {
    //     console.log("Configuración");
    //     onClose();
    //   },
    // },
    // {
    //   text: "Notificaciones",
    //   icon: <NotificationsIcon />,
    //   action: () => {
    //     console.log("Notificaciones");
    //     onClose();
    //   },
    // },    
    {
      text: "Mis Eventos",
      icon: <EventAvailableIcon />,
      action: () => {
        navigate('/organizer-events');
        onClose();
      },
    },
    // {
    //   text: "Tema",
    //   icon: <PaletteIcon />,
    //   action: () => {
    //     console.log("Cambiar tema");
    //     onClose();
    //   },
    // },
    // {
    //   text: "Ayuda",
    //   icon: <HelpOutlineIcon />,
    //   action: () => {
    //     console.log("Ayuda");
    //     onClose();
    //   },
    // },
  ];

  const handleLogout = () => {
    logout();
    console.log("Cerrar sesión");
    onClose();
  };  
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{        "& .MuiDrawer-paper": {
          width: 320,
          height: "100vh",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.primary.main}`,
          borderRight: "none",
          borderRadius: "8px 0 0 8px",
          overflow: "hidden",
          boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>        {/* Header */}        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid rgba(74, 255, 117, 0.3)`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: "0.9rem",
                width: 40,
                height: 40,
                fontWeight: "600",
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: "600", 
                color: theme.palette.text.primary,
                fontSize: "1rem",
                lineHeight: 1.3,
              }}>
                {`${name} ${lastname}`}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: theme.palette.text.secondary,
                fontSize: "0.8rem",
              }}>
                {identity?.email || "usuario@ejemplo.com"}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.primary.main,
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>        {/* Menu Items */}
        <Box sx={{ 
          flex: 1, 
          py: 1, 
          px: 1, 
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "3px",
            opacity: 0.7,
          },
        }}>
          <List sx={{ padding: 0 }}>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                onClick={item.action}
                sx={{
                  cursor: "pointer",
                  mx: 1,
                  borderRadius: "8px",
                  mb: 0.5,
                  padding: "10px 14px",
                  transition: "all 0.2s ease",
                  border: "1px solid transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.background.paper,
                    borderColor: `rgba(74, 255, 117, 0.3)`,
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: theme.palette.text.secondary, 
                    minWidth: 36,
                    transition: "color 0.2s ease",
                    "& .MuiSvgIcon-root": {
                      fontSize: "1.2rem",
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      transition: "color 0.2s ease",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>        {/* Footer */}
        <Box sx={{ p: 2, borderTop: `1px solid rgba(74, 255, 117, 0.3)` }}>
          <ListItem
            onClick={handleLogout}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              padding: "10px 14px",
              backgroundColor: "transparent",
              border: `1px solid rgba(74, 255, 117, 0.3)`,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.primary.main,
                "& .MuiListItemIcon-root": {
                  color: theme.palette.primary.main,
                },
                "& .MuiListItemText-primary": {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: theme.palette.text.secondary, 
                minWidth: 36,
                transition: "color 0.2s ease",
                "& .MuiSvgIcon-root": {
                  fontSize: "1.2rem",
                },
              }}
            >
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar Sesión"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  transition: "color 0.2s ease",
                },
              }}
            />
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomUserMenu;
