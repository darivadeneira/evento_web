import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Arreglar los iconos de Leaflet
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

// Crear icono personalizado para la ubicación seleccionada
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-location-marker',
    html: `
      <div style="
        background-color: #4AFF75;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(74, 255, 117, 0.4);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 12px solid #4AFF75;
        "></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });
};

interface MapClickHandlerProps {
  onLocationSelect: (coords: [number, number]) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect([lng, lat]); // Nota: [longitud, latitud] para el formato Point
    },
  });
  return null;
};

interface LocationPickerMapProps {
  selectedLocation?: [number, number]; // [lng, lat]
  onLocationSelect: (coords: [number, number]) => void;
  height?: number;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ selectedLocation, onLocationSelect, height = 300 }) => {
  // Centro por defecto en Quito, Ecuador
  const [mapCenter] = useState<[number, number]>([-0.1807, -78.4678]);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  useEffect(() => {
    // Si hay una ubicación seleccionada, centrar el mapa en ella
    if (selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0) {
      setMapKey((prev) => prev + 1); // Forzar re-render para actualizar centro
    }
  }, [selectedLocation]);

  const handleLocationSelect = (coords: [number, number]) => {
    onLocationSelect(coords);
  };

  // Determinar el centro del mapa
  const currentCenter =
    selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0
      ? ([selectedLocation[1], selectedLocation[0]] as [number, number]) // [lat, lng] para el mapa
      : mapCenter;

  return (
    <div style={{ height: `${height}px`, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        key={mapKey}
        center={currentCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador para la ubicación seleccionada */}
        {selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0 && (
          <Marker
            position={[selectedLocation[1], selectedLocation[0]]} // [lat, lng] para el marcador
            icon={createCustomIcon()}
          >
            <Popup>
              <div style={{ textAlign: 'center', padding: '8px' }}>
                <strong>📍 Ubicación del Evento</strong>
                <br />
                <small>
                  Lat: {selectedLocation[1].toFixed(6)}
                  <br />
                  Lng: {selectedLocation[0].toFixed(6)}
                </small>
              </div>
            </Popup>
          </Marker>
        )}

        <MapClickHandler onLocationSelect={handleLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
