"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
  };
};

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then(setOrders)
      .catch(() => setError("Could not load your orders."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900">Order History</h1>
      <p className="mt-2 text-neutral-600">Track your past deliveries.</p>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p className="text-neutral-500">Loading your orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-neutral-500">You have no past orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-2xl border border-neutral-200 p-6"
            >
              <div>
                <p className="font-semibold text-neutral-900">
                  Order #{order.id.slice(-6).toUpperCase()}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {order.items.map((i) => i.menuItem.name).join(", ")}
                </p>
                {["picked_up", "on_the_way"].includes(order.status) && (
                  <Link
                    href={`/delivery/track/${order.id}`}
                    className="mt-2 inline-block text-xs font-medium text-gold-dark hover:underline"
                  >
                    Track Live →
                  </Link>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gold-dark">
                  ${order.total.toFixed(2)}
                </p>
                <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-700">
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}