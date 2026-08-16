"use client";

import { useEffect, useState } from "react";

type MenuItemRef = { menuItem: { name: string }; quantity: number };
type AdminOrder = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  total: number;
  status: string;
  createdAt: string;
  driver: { name: string } | null;
  items: MenuItemRef[];
};

const STATUS_FILTERS = ["all", "pending", "confirmed", "preparing", "picked_up", "on_the_way", "delivered", "cancelled"];

const statusStyles: Record<string, string> = {
  pending: "bg-neutral-200 text-neutral-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-gold/20 text-gold-dark",
  picked_up: "bg-purple-100 text-purple-700",
  on_the_way: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = () => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then(setOrders)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900">Manage Orders</h1>
      <p className="mt-2 text-neutral-600">
        Confirm new orders and move them to preparing so drivers can pick them up.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === s
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p className="text-neutral-500">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-neutral-500">No orders in this category.</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-neutral-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-900">{order.name}</p>
                  <p className="text-sm text-neutral-600">{order.address}, {order.city}</p>
                  <p className="text-sm text-neutral-500">{order.phone}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Placed {new Date(order.createdAt).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                  {order.driver && (
                    <p className="mt-1 text-xs text-neutral-500">Driver: {order.driver.name}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gold-dark">${order.total.toFixed(2)}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      statusStyles[order.status] || "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Action buttons based on current status */}
              <div className="mt-4 flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateStatus(order.id, "confirmed")}
                    disabled={updatingId === order.id}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Confirm Order
                  </button>
                )}

                {order.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(order.id, "preparing")}
                    disabled={updatingId === order.id}
                    className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
                  >
                    Send to Kitchen (Start Preparing)
                  </button>
                )}

                {order.status === "preparing" && !order.driver && (
                  <p className="text-xs text-neutral-500 self-center">
                    Waiting for a driver to accept this order.
                  </p>
                )}

                {["pending", "confirmed"].includes(order.status) && (
                  <button
                    onClick={() => updateStatus(order.id, "cancelled")}
                    disabled={updatingId === order.id}
                    className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}