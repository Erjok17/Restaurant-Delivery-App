"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { RESTAURANT_LOCATION } from "@/lib/constants";

const DeliveryMap = dynamic(() => import("@/components/map/DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-100">
      <p className="text-sm text-neutral-500">Loading map...</p>
    </div>
  ),
});

type MenuItemRef = { menuItem: { name: string }; quantity: number };
type OrderRef = {
  id: string;
  name: string;
  address: string;
  city: string;
  total: number;
  status: string;
  deliveryLat: number | null;
  deliveryLng: number | null;
  items: MenuItemRef[];
};

export default function DriverDashboardPage() {
  const [available, setAvailable] = useState<OrderRef[]>([]);
  const [mine, setMine] = useState<OrderRef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sharingOrderId, setSharingOrderId] = useState<string | null>(null);
  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number } | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastSentRef = useRef<number>(0);

  const loadOrders = () => {
    fetch("/api/driver/orders", {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setAvailable(data.available ?? []);
        setMine(data.mine ?? []);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 6000);
    return () => clearInterval(interval);
  }, []);

  const acceptOrder = async (orderId: string) => {
    await fetch(`/api/driver/orders/${orderId}/accept`, {
      method: "POST",
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    loadOrders();
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/driver/orders/${orderId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ status }),
    });
    loadOrders();
    if (status === "delivered") stopSharing();
  };

  const startSharing = async (orderId: string) => {
    if (!navigator.geolocation) {
      alert("Geolocation isn't supported on this device.");
      return;
    }

    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      }
    } catch (err) {
      console.warn("Wake lock not available:", err);
    }

    setSharingOrderId(orderId);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
        setDriverPos(newPos);

        const now = Date.now();
        if (now - lastSentRef.current < 4000) return;
        lastSentRef.current = now;

        fetch(`/api/driver/orders/${orderId}/location`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(newPos),
        })
          .then((res) => {
            if (!res.ok) console.warn("Location update skipped:", res.status);
          })
          .catch((err) => console.warn("Location fetch error:", err));
      },
      (err) => console.error("Location error:", { code: err.code, message: err.message }),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
    setSharingOrderId(null);
  };

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (
        document.visibilityState === "visible" &&
        sharingOrderId &&
        "wakeLock" in navigator
      ) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        } catch (err) {
          console.warn("Could not re-acquire wake lock:", err);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [sharingOrderId]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900">Driver Dashboard</h1>

      {isLoading ? (
        <p className="mt-8 text-neutral-500">Loading orders...</p>
      ) : (
        <>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-neutral-900">My Deliveries</h2>
            {mine.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-500">No active deliveries.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {mine.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-gold/40 bg-gold/5 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-neutral-900">{order.name}</p>
                        <p className="text-sm text-neutral-600">{order.address}, {order.city}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-gold-dark">
                        {order.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.status === "preparing" && (
                        <button
                          onClick={() => {
                            updateStatus(order.id, "picked_up");
                            startSharing(order.id);
                          }}
                          className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark"
                        >
                          Mark Picked Up & Start Sharing Location
                        </button>
                      )}

                      {order.status === "picked_up" && (
                        <>
                          {sharingOrderId !== order.id && (
                            <button
                              onClick={() => startSharing(order.id)}
                              className="rounded-full border border-gold px-4 py-2 text-sm font-medium text-gold-dark hover:bg-gold hover:text-white"
                            >
                              Resume Sharing Location
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(order.id, "on_the_way")}
                            className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark"
                          >
                            Mark On The Way
                          </button>
                        </>
                      )}

                      {order.status === "on_the_way" && (
                        <button
                          onClick={() => updateStatus(order.id, "delivered")}
                          className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {sharingOrderId === order.id && (
                        <span className="flex items-center gap-1.5 self-center text-xs text-green-600">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                          Sharing live location
                        </span>
                      )}
                    </div>

                    {sharingOrderId === order.id && order.deliveryLat && order.deliveryLng && (
                      <div className="mt-4 space-y-3">
                        <div className="h-64 w-full overflow-hidden rounded-xl">
                          <DeliveryMap
                            restaurant={RESTAURANT_LOCATION}
                            destination={{ lat: order.deliveryLat, lng: order.deliveryLng }}
                            driverLocation={driverPos}
                          />
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${order.deliveryLat},${order.deliveryLng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                        >
                          Open Turn-by-Turn Directions ↗
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-neutral-900">Available Orders</h2>
            {available.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-500">No orders ready for pickup right now.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {available.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-neutral-200 p-5">
                    <p className="font-semibold text-neutral-900">{order.name}</p>
                    <p className="text-sm text-neutral-600">{order.address}, {order.city}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gold-dark">${order.total.toFixed(2)}</p>
                    <button
                      onClick={() => acceptOrder(order.id)}
                      className="mt-3 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                    >
                      Accept Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}