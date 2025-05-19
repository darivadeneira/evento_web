import { useState } from 'react';
import { 
    useLogin, 
    useNotify,
    Form,
    TextInput,
    PasswordInput,
    required,
    Button,
    Link,
    Title,
} from 'react-admin';
import {
    Box,
    Card,
    CircularProgress,
    CssBaseline,
    Typography
} from '@mui/material';
import { ThemeProvider} from '@mui/material/styles';
import HelpIcon from '@mui/icons-material/Help';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import { createLoginTheme } from '../../theme/loginTheme';




export const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const login = useLogin();
    const notify = useNotify();

    const loginTheme = createLoginTheme('/mapa1.jpg');

    const handleSubmit = (formValues: FieldValues) => {
        setLoading(true);
        login({ 
            username: formValues.username as string, 
            password: formValues.password as string 
        })
            .then(() => {
                window.location.href = '/dashboard';
            })
            .catch((error) => {
                // Captura el mensaje real del backend si existe
                let message = 'Credenciales inválidas';
                if (error && (error.message || error.body?.message)) {
                    message = error.body?.message || error.message;
                }
                notify(message, { type: 'error' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <ThemeProvider theme={loginTheme}>
            <CssBaseline />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100vh',
                    minWidth: '100vw',
                    zIndex: 0,
                    overflow: 'hidden',
                    m: 0,
                    p: 0,
                    background: 'url("/Images/Background.jpg") center/cover no-repeat',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(34,40,49,0.55)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1,
                    },
                }}
            >
                <Title title="Iniciar Sesión" />
                <Card
                    sx={{
                        minWidth: 300,
                        maxWidth: 400,
                        width: '90vw',
                        p: 4,
                        borderRadius: 4,
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        background: 'rgba(255, 255, 255, 0.85)',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '2px solid',
                        borderColor: '#7FA8FF',
                    }}
                >
                    {/* Ícono de ticket y mensaje de bienvenida */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <img src="/Images/Logo.png" alt="Ticket Logo" style={{ width: 220, height: 150, filter: 'drop-shadow(0 2px 8px #7FA8FF88)' }} />
        
                        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                            Iniciar Sesión
                        </Typography>
                    </Box>
                    <Form onSubmit={handleSubmit}>
                        <Box sx={{ marginTop: 2 }}>
                            <TextInput
                                source="username"
                                label="Usuario"
                                fullWidth
                                disabled={loading}
                                autoFocus
                                validate={required()}
                                sx={{ '& .RaInput-input': { borderRadius: 2 } }}
                            />
                        </Box>
                        <Box sx={{ marginTop: 2 }}>
                            <PasswordInput
                                source="password"
                                label="Contraseña"
                                fullWidth
                                disabled={loading}
                                validate={required()}
                                sx={{ '& .RaInput-input': { borderRadius: 2 } }}
                            />
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                fullWidth
                                color="primary"
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    borderRadius: 3,
                                    minHeight: 48,
                                    boxShadow: '0 2px 8px rgba(31, 38, 135, 0.15)',
                                    transition: 'background 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#7FA8FF', // color igual en mobile y pc
                                    '&:hover': {
                                        backgroundColor: '#5A7FFF',
                                    },
                                    mx: { xs: 'auto', sm: 0 }, // centrado en mobile
                                    width: { xs: '80%', sm: '100%' },
                                }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={18} thickness={2} sx={{ mr: 1 }} />
                                        Iniciando...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                        </Box>
                    </Form>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Link to="/auth/signup" sx={{ display: 'flex', alignItems: 'center', color: '#7FA8FF', fontWeight: 500, fontSize: '1rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                            <AddCircleOutlineIcon sx={{ mr: 0.5, fontSize: '1.1rem', color: '#7FA8FF' }} />
                            Crear cuenta
                        </Link>
                        <Link to="/auth/help" sx={{ display: 'flex', alignItems: 'center', color: '#7FA8FF', fontWeight: 500, fontSize: '1rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                            <HelpIcon sx={{ mr: 0.5, fontSize: '1.1rem', color: '#7FA8FF' }} />
                            Ayuda
                        </Link>
                    </Box>
                </Card>
            </Box>
        </ThemeProvider>
    );
};
