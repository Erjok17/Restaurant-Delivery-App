"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DeliveryMap from "@/components/map/DeliveryMapLoader";

type TrackingData = {
  status: string;
  driverName: string | null;
  driverLocation: { lat: number; lng: number } | null;
  locationUpdatedAt: string | null;
  restaurant: { lat: number; lng: number };
  destination: { lat: number; lng: number } | null;
  distanceKm: number | null;
  etaMinutes: number | null;
  timestamps: {
    createdAt: string;
    confirmedAt: string | null;
    pickedUpAt: string | null;
    deliveredAt: string | null;
  };
};

const STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "picked_up", label: "Picked Up" },
  { key: "on_the_way", label: "On The Way" },
  { key: "delivered", label: "Delivered" },
];

function getFreshnessLabel(updatedAt: string | null): { label: string; isStale: boolean } {
  if (!updatedAt) return { label: "", isStale: false };
  const secondsAgo = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 1000);

  if (secondsAgo < 15) return { label: "Live", isStale: false };
  if (secondsAgo < 60) return { label: `Updated ${secondsAgo}s ago`, isStale: false };

  const minutesAgo = Math.floor(secondsAgo / 60);
  return { label: `Signal paused — last seen ${minutesAgo} min ago`, isStale: true };
}

export default function TrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => {
      fetch(`/api/orders/${orderId}/tracking`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(setData)
        .catch(() => setError("Could not load order tracking."));
    };

    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-neutral-500">Loading your order...</p>
      </div>
    );
  }

  const activeStepIndex = STEPS.findIndex((s) => s.key === data.status);
  const freshness = getFreshnessLabel(data.locationUpdatedAt);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900">Track Your Order</h1>

      {/* Status timeline */}
      <div className="mt-8 flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex flex-1 flex-col items-center text-center">
            <div
              className={`h-3 w-3 rounded-full ${
                i <= activeStepIndex ? "bg-gold" : "bg-neutral-200"
              }`}
            />
            <p
              className={`mt-2 text-[11px] font-medium ${
                i <= activeStepIndex ? "text-gold-dark" : "text-neutral-400"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>

      {/* ETA + driver info */}
      {(data.status === "on_the_way" || data.status === "picked_up") && (
        <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/5 p-5">
          {data.driverName && (
            <p className="font-semibold text-neutral-900">{data.driverName} is delivering your order</p>
          )}
          {data.etaMinutes !== null && (
            <p className="mt-1 text-2xl font-bold text-gold-dark">
              {data.etaMinutes} min <span className="text-sm font-normal text-neutral-500">away</span>
            </p>
          )}
          <p
            className={`mt-2 flex items-center gap-1.5 text-xs ${
              freshness.isStale ? "text-orange-600" : "text-green-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                freshness.isStale ? "bg-orange-500" : "animate-pulse bg-green-500"
              }`}
            />
            {freshness.label}
          </p>
        </div>
      )}

      {data.status === "delivered" && (
        <div className="mt-8 rounded-2xl bg-green-50 p-5 text-center">
          <p className="font-semibold text-green-700">Your order has been delivered. Enjoy!</p>
        </div>
      )}

      {/* Map */}
      {data.destination && (
        <div className="mt-8 h-96 w-full overflow-hidden rounded-2xl border border-neutral-200">
          <DeliveryMap
            restaurant={data.restaurant}
            destination={data.destination}
            driverLocation={data.driverLocation}
          />
        </div>
      )}

      {!data.destination && (
        <p className="mt-8 text-center text-sm text-neutral-500">
          Live map isn't available for this order — location wasn't shared at checkout.
        </p>
      )}
    </div>
  );
}