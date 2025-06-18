import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
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
        box-shadow: 0 2px 8px rgba(255, 18, 18, 0.4);
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
          border-bottom: 12px solidrgb(0, 0, 0);
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

// Nuevo componente para centrar el mapa cuando cambia la ubicación seleccionada
const CenterMapOnSelect: React.FC<{ selectedLocation?: [number, number] }> = ({ selectedLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0) {
      map.setView([selectedLocation[1], selectedLocation[0]], map.getZoom(), { animate: true });
    }
  }, [selectedLocation, map]);
  return null;
};

interface LocationPickerMapProps {
  selectedLocation?: [number, number]; // [lng, lat]
  onLocationSelect: (coords: [number, number]) => void;
  height?: number;
  onAddressChange?: (address: string | null) => void;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  selectedLocation,
  onLocationSelect,
  height = 300,
  onAddressChange,
}) => {
  // Centro por defecto en Quito, Ecuador
  const [mapCenter] = useState<[number, number]>([-0.1807, -78.4678]);
  const [address, setAddress] = useState<string | null>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Obtener dirección cuando cambia la ubicación seleccionada
  useEffect(() => {
    const fetchAddress = async () => {
      if (selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0) {
        setAddress(null); // Limpiar antes de buscar
        if (onAddressChange) onAddressChange(null);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${selectedLocation[1]}&lon=${selectedLocation[0]}&accept-language=es`,
          );
          const data = await response.json();
          const found = data.display_name || 'Dirección no encontrada';
          setAddress(found);
          if (onAddressChange) onAddressChange(found);
        } catch (e) {
          setAddress('No se pudo obtener la dirección');
          if (onAddressChange) onAddressChange('No se pudo obtener la dirección');
        }
      } else {
        setAddress(null);
        if (onAddressChange) onAddressChange(null);
      }
    };
    fetchAddress();
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
        <CenterMapOnSelect selectedLocation={selectedLocation} />
        {/* Marcador para la ubicación seleccionada */}
        {selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0 && (
          <Marker
            position={[selectedLocation[1], selectedLocation[0]]}
            icon={createCustomIcon()}
            ref={markerRef}
            eventHandlers={{
              add: () => {
                if (markerRef.current) {
                  markerRef.current.openPopup();
                }
              },
            }}
          >
            {/* Elimina el Popup del Marker (opcional, si ya no quieres mostrarlo) */}
          </Marker>
        )}
        <MapClickHandler onLocationSelect={handleLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
