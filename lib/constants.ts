// Simple restaurant-wide capacity per time slot.
// Once an admin dashboard exists, this should become configurable per time slot/table.
export const CAPACITY_PER_SLOT = 40;
export const MAX_PARTY_SIZE_ONLINE = 8; // larger parties should call the restaurant
export const CANCELLATION_WINDOW_HOURS = 2;
// TODO: replace with your restaurant's real coordinates
export const RESTAURANT_LOCATION = { lat: 38.9072, lng: -77.0369 };
export const AVERAGE_DELIVERY_SPEED_KMH = 30;