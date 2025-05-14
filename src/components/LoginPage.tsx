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
import { createLoginTheme } from '../theme/loginTheme';




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
            .catch(() => {
                notify('Credenciales inválidas', { type: 'error' });
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
                minHeight="100vh"
                alignItems="center"
                justifyContent="center"
                
            >
                <Title title="Iniciar Sesión" />
                
                <Card sx={{ minWidth: 300, maxWidth: 500, padding: '2em', backgroundColor: 'white' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '1em',
                        }}
                    >
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Typography variant="h1" component="h1" gutterBottom >
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
                            />
                        </Box>
                        <Box sx={{ marginTop: 2 }}>
                            <PasswordInput
                                source="password"
                                label="Contraseña"
                                fullWidth
                                disabled={loading}
                                validate={required()}
                            />
                        </Box>
                        <Box sx={{ padding: '1em 0 0 0' }}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                fullWidth
                                label={loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                color="primary"
                            >
                                {loading && (
                                    <CircularProgress
                                        size={18}
                                        thickness={2}
                                    />
                                )}
                            </Button>
                        </Box>
                    </Form>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Link
                            to="/auth/signup"
               
                        >
                            <AddCircleOutlineIcon sx={{ mr: 0.5, fontSize: '0.875rem', color: '#7FA8FF' }} />
                            Crear cuenta
                        </Link>
                        <Link
                            to="/auth/help"
                        >
                            <HelpIcon sx={{ mr: 0.5, fontSize: '0.875rem', color: '#7FA8FF' }} />
                            Ayuda
                        </Link>
                    </Box>
                </Card>
            </Box>
        </ThemeProvider>
    );
};
