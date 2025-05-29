import {
    List,
    useListContext,
    DateField,
    RecordContextProvider
} from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Button
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

const EventGrid = () => {
    const { data, isLoading } = useListContext();
    console.log("data", data);

    if (isLoading || !data) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 0
            }}
        >
            {data.map(event => (
                <RecordContextProvider key={event.id} value={event}>
                    <Box
                        sx={{
                            flexGrow: 0,
                            flexShrink: 0,
                            flexBasis: {
                                xs: '100%',
                                sm: 'calc(50% - 16px)',
                                md: 'calc(33.333% - 16px)',
                                lg: 'calc(25% - 16px)'
                            },
                            minWidth: 280
                        }}
                    >
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    height: 200,
                                    position: 'relative',
                                    backgroundColor: theme => theme.palette.primary.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    overflow: 'hidden'
                                }}
                            >
                                <Typography variant="h5" sx={{ textAlign: 'center', p: 2 }}>
                                    {event.name}
                                </Typography>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        display: 'flex',
                                        gap: 1
                                    }}
                                >
                                    <Chip
                                        label={event.state}
                                        size="small"
                                        color={event.state === 'active' ? 'success' : 'default'}
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.9)'
                                        }}
                                    />
                                </Box>
                            </Box>
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {event.description}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarMonthIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        <DateField source="date" /> - {event.hour}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {event.location}, {event.city}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        Capacidad: {event.capacity}
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    >
                                        Detalles
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        fullWidth
                                        color={event.state === 'active' ? 'primary' : 'inherit'}
                                        disabled={event.state !== 'active'}
                                    >
                                        Comprar
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export const EventList = () => (
    <List
        resource="event-entity"
        component="div"
        sx={{
            backgroundColor: 'transparent',
            '& .RaList-content': {
                backgroundColor: 'transparent',
                boxShadow: 'none'
            }
        }}
    >
        <EventGrid />
    </List>
); 