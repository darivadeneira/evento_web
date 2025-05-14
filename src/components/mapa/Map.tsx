import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import './Map.css';

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

const ApiNotice: React.FC = () => (
  <div className="osrm-notice">
  </div>
);

const OSRM_SERVER_URL = 'http://localhost:5000';

interface RoutingMachineProps {
  userPosition: [number, number];
  destination: [number, number];
}

const RoutingMachine: React.FC<RoutingMachineProps> = ({ userPosition, destination }) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const routeLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !userPosition || !destination) return;
    setRoutingError(null);
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
    try {
      const startPoint = L.latLng(userPosition[0], userPosition[1]);
      const endPoint = L.latLng(destination[0], destination[1]);
      const url = `${OSRM_SERVER_URL}/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?steps=true&geometries=geojson&overview=full&annotations=true`;
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'route-loading';
      loadingDiv.innerHTML = '<div class="spinner-small"></div><p>Calculando ruta...</p>';
      document.querySelector('.map-container')?.appendChild(loadingDiv);
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error de API: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          document.querySelector('.route-loading')?.remove();
          if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('No se encontró ninguna ruta');
          }
          const route = data.routes[0];
          const { geometry, legs } = route;
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
          const instructionsPanel = document.createElement('div');
          instructionsPanel.className = 'route-instructions-panel';
          const duration = Math.round(route.duration / 60);
          const distance = (route.distance / 1000).toFixed(1);
          instructionsPanel.innerHTML = `
            <div class="route-summary">
              <h3>Resumen de la ruta</h3>
              <p>Distancia: ${distance} km</p>
              <p>Tiempo estimado: ${duration} minutos</p>
            </div>
            <div class="route-steps">
              <h3>Instrucciones</h3>
              <ul>
                ${legs.flatMap((leg: any) => leg.steps).map((step: any) => `
                  <li>
                    <span class="step-instruction">${translateManeuver(step.maneuver.type, step.maneuver.modifier)}</span>
                    <span class="step-distance">${(step.distance / 1000).toFixed(1)} km</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <button class="close-panel">Cerrar</button>
          `;
          document.querySelector('.map-container')?.appendChild(instructionsPanel);
          document.querySelector('.close-panel')?.addEventListener('click', () => {
            instructionsPanel.remove();
          });
        })
        .catch(error => {
          const loadingEl = document.querySelector('.route-loading');
          if (loadingEl) loadingEl.remove();
          setRoutingError(`Error al calcular la ruta: ${error.message}`);
        });
      return () => {
        if (routeLayerRef.current) {
          map.removeLayer(routeLayerRef.current);
        }
        const loadingEl = document.querySelector('.route-loading');
        if (loadingEl) loadingEl.remove();
        const instructionsEl = document.querySelector('.route-instructions-panel');
        if (instructionsEl) instructionsEl.remove();
      };
    } catch (error: any) {
      setRoutingError(`Error al inicializar el servicio de rutas: ${error.message}`);
    }
  }, [map, userPosition, destination]);

  const translateManeuver = (type: string, modifier: string) => {
    const typeTranslations: Record<string, string> = {
      'turn': 'Gira',
      'new name': 'Continúa en',
      'depart': 'Sal de',
      'arrive': 'Llega a destino',
      'merge': 'Incorpórate',
      'on ramp': 'Toma la rampa',
      'off ramp': 'Sal por la rampa',
      'fork': 'Toma el desvío',
      'end of road': 'Fin de la calle',
      'continue': 'Continúa',
      'roundabout': 'Entra en la rotonda',
      'rotary': 'Entra en la glorieta',
      'roundabout turn': 'En la rotonda',
      'exit roundabout': 'Sal de la rotonda',
      'exit rotary': 'Sal de la glorieta'
    };
    const modifierTranslations: Record<string, string> = {
      'left': 'a la izquierda',
      'slight left': 'ligeramente a la izquierda',
      'sharp left': 'bruscamente a la izquierda',
      'right': 'a la derecha',
      'slight right': 'ligeramente a la derecha',
      'sharp right': 'bruscamente a la derecha',
      'straight': 'recto',
      'uturn': 'da la vuelta'
    };
    const typeText = typeTranslations[type] || type;
    const modifierText = modifierTranslations[modifier] || modifier;
    return `${typeText} ${modifierText}`;
  };

  if (routingError) {
    return (
      <div className="routing-error">
        <p>{routingError}</p>
        <p>Intenta seleccionar un destino más cercano o recarga la página.</p>
      </div>
    );
  }
  return null;
};

interface MapClickHandlerProps {
  onLocationSelect: (coords: [number, number]) => void;
}
const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]);
    },
  });
  return null;
};

interface LocationSearchProps {
  onSearch: (coords: [number, number]) => void;
}
const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        onSearch([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert('No se encontró la ubicación. Intenta ser más específico.');
      }
    } catch (error) {
      alert('Error al buscar ubicación. Por favor intenta de nuevo.');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Buscar destino..."
        className="search-input"
      />
      <button type="submit" className="search-button">Buscar</button>
    </form>
  );
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
  useEffect(() => {
    if (presetDestination) {
      setDestination(presetDestination);
    }
  }, [presetDestination]);
  const handleLocationSelect = (coords: [number, number]) => {
    setDestination(coords);
  };
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
    <div className="map-container">
      <div className="search-container">
        <LocationSearch onSearch={handleLocationSelect} />
        <div className="instructions">
          <p>Haz clic en cualquier punto del mapa para establecer un destino</p>
          {destination && (
            <button 
              className="clear-button" 
              onClick={() => setDestination(null)}
            >
              Limpiar ruta
            </button>
          )}
        </div>
        <ApiNotice />
      </div>
      <MapContainer 
        center={userPosition} 
        zoom={14} 
        style={{ height: 'calc(100vh - 120px)', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userPosition}>
          <Popup>
            <b>Tu ubicación actual</b>
          </Popup>
        </Marker>
        {destination && (
          <Marker position={destination}>
            <Popup>
              <b>Destino seleccionado</b>
              <p>Lat: {destination[0].toFixed(6)}, Lng: {destination[1].toFixed(6)}</p>
            </Popup>
          </Marker>
        )}
        {destination && (
          <RoutingMachine userPosition={userPosition} destination={destination} />
        )}
        <MapClickHandler onLocationSelect={handleLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapView;
