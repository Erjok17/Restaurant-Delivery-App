"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { driverIcon, destinationIcon, restaurantIcon } from "./icons";

type LatLng = { lat: number; lng: number };

type DeliveryMapProps = {
  restaurant: LatLng;
  destination: LatLng | null;
  driverLocation: LatLng | null;
};

export default function DeliveryMap({
  restaurant,
  destination,
  driverLocation,
}: DeliveryMapProps) {
  const center = driverLocation ?? destination ?? restaurant;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={[restaurant.lat, restaurant.lng]} icon={restaurantIcon}>
        <Popup>Bella Cucina</Popup>
      </Marker>

      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>
      )}

      {driverLocation && (
        <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
          <Popup>Driver</Popup>
        </Marker>
      )}

      {driverLocation && destination && (
        <Polyline
          positions={[
            [driverLocation.lat, driverLocation.lng],
            [destination.lat, destination.lng],
          ]}
          color="#3388ff"
          dashArray="6 8"
        />
      )}
    </MapContainer>
  );
}