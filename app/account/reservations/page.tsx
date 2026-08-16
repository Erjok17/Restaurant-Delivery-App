"use client";

import { useEffect, useState } from "react";
import { CANCELLATION_WINDOW_HOURS } from "@/lib/constants";

type Reservation = {
  id: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  specialRequests: string | null;
};

function canCancel(reservation: Reservation) {
  if (reservation.status === "cancelled") return false;
  const [hours, minutes] = reservation.time.split(":").map(Number);
  const dateTime = new Date(reservation.date);
  dateTime.setHours(hours, minutes);
  const hoursUntil = (dateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntil >= CANCELLATION_WINDOW_HOURS;
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-neutral-200 text-neutral-700",
  "no-show": "bg-orange-100 text-orange-700",
};

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadReservations = () => {
    fetch("/api/reservations")
      .then((res) => res.json())
      .then(setReservations)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    setMessage("");

    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Could not cancel reservation");

      loadReservations();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900">My Reservations</h1>
      <p className="mt-2 text-neutral-600">View and manage your table bookings.</p>

      {message && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{message}</div>
      )}

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : reservations.length === 0 ? (
          <p className="text-neutral-500">You have no reservations yet.</p>
        ) : (
          reservations.map((r) => (
            <div key={r.id} className="rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {new Date(r.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {r.time}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {r.guests} guest{r.guests !== 1 ? "s" : ""}
                  </p>
                  {r.specialRequests && (
                    <p className="mt-1 text-sm text-neutral-500">Note: {r.specialRequests}</p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[r.status] || "bg-neutral-100 text-neutral-700"}`}
                >
                  {r.status}
                </span>
              </div>

              {canCancel(r) && (
                <button
                  onClick={() => handleCancel(r.id)}
                  disabled={cancellingId === r.id}
                  className="mt-4 text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                >
                  {cancellingId === r.id ? "Cancelling..." : "Cancel Reservation"}
                </button>
              )}
              {r.status === "confirmed" && !canCancel(r) && (
                <p className="mt-4 text-xs text-neutral-400">
                  Too close to reservation time to cancel online — please call us.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}