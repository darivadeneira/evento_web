import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Iconos personalizados para los marcadores
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Arreglar los iconos de Leaflet
const fixLeafletIcon = () => {
  // Corregir los iconos de marcadores de Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

// Componente para mostrar la ruta entre dos puntos (sin resumen ni instrucciones)
interface RouteLineProps {
  userPosition: [number, number];
  destination: [number, number];
}
const RouteLine = ({ userPosition, destination }: RouteLineProps) => {
  const map = useMap();
  const routeLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!userPosition || !destination) return;
    // Usa el backend local en vez del router público
    const url = `http://localhost:5000/route/v1/driving/${userPosition[1]},${userPosition[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) return;
        const route = data.routes[0];
        const { geometry } = route;
        if (routeLayerRef.current) {
          map.removeLayer(routeLayerRef.current);
        }
        const routeLine = L.geoJSON(geometry, {
          style: {
            color: '#6366F1',
            weight: 5,
            opacity: 0.7,
            lineJoin: 'round'
          }
        }).addTo(map);
        routeLayerRef.current = routeLine;
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
      });
    return () => {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
      }
    };
  }, [userPosition, destination, map]);

  return null;
};

interface MapViewProps {
  presetDestination?: [number, number] | null;
}
const MapView: React.FC<MapViewProps> = ({ presetDestination = null }) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(presetDestination);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fixLeafletIcon();
  }, []);
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition([latitude, longitude]);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        alert('No se pudo obtener tu ubicación. Por favor habilita los servicios de localización.');
      }
    );
  }, []);
  // Solo actualiza el destino si realmente cambió
  useEffect(() => {
    if (
      presetDestination &&
      (!destination || presetDestination[0] !== destination[0] || presetDestination[1] !== destination[1])
    ) {
      setDestination(presetDestination);
    }
  }, [presetDestination]);
  if (isLoading) {
    return (
      <div className="loading">
        <p>Obteniendo tu ubicación...</p>
        <div className="spinner"></div>
      </div>
    );
  }
  if (!userPosition) {
    return (
      <div className="error-message">
        <p>No se pudo obtener tu ubicación.</p>
        <p>Por favor habilita los servicios de localización en tu navegador e intenta de nuevo.</p>
      </div>
    );
  }
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Leyenda de colores */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" alt="azul" style={{ width: 18, height: 28 }} />
          <span style={{ fontSize: 14 }}>Tu ubicación</span>
        </div>
        {destination && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="verde" style={{ width: 18, height: 28 }} />
            <span style={{ fontSize: 14 }}>Ubicación del evento</span>
          </div>
        )}
      </div>
      <div className="map-container" style={{ width: '100%', height: 'calc(100% - 36px)' }}>
        <MapContainer 
          center={userPosition} 
          zoom={14} 
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={userPosition} icon={blueIcon}>
            <Popup>
              Tú estás aquí
            </Popup>
          </Marker>
          {destination && (
            <Marker position={destination} icon={greenIcon}>
              <Popup>
                Ubicación del evento<br />
                Lat: {destination[0].toFixed(6)}, Lng: {destination[1].toFixed(6)}
              </Popup>
            </Marker>
          )}
          {/* Mostrar la línea de la ruta si hay destino */}
          {userPosition && destination && (
            <RouteLine userPosition={userPosition} destination={destination} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
