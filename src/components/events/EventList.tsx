import {
    List,
    useListContext,
    RecordContextProvider
} from 'react-admin';
import {
    Box,
} from '@mui/material';
import EventCard from './EventCard';
import type { IEvent } from '../../types/event.type';

const EventGrid = () => {
    const { data, isLoading } = useListContext();
    console.log("data", data);

    if (isLoading || !data) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr', // 1 columna en mobile
                    sm: '1fr 1fr', // 2 columnas en pantallas pequeñas
                    md: '1fr 1fr 1fr' // 3 columnas en desktop
                },
                gap: 3,
                justifyContent: 'center',
                alignItems: 'center',
                mt: 0,
                width: '100%',
            }}
        >
            {data.map((event: IEvent) => (
                <RecordContextProvider key={event.id} value={event}>
                    <EventCard event={event} />
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