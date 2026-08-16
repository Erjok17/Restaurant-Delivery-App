"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MAX_PARTY_SIZE_ONLINE } from "@/lib/constants";

export default function ReservationsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<{ available: boolean; remaining: number } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Live-check availability whenever date or time changes
  useEffect(() => {
    if (!formData.date || !formData.time) {
      setAvailability(null);
      return;
    }

    setCheckingAvailability(true);
    const timeout = setTimeout(() => {
      fetch(`/api/reservations/availability?date=${formData.date}&time=${formData.time}`)
        .then((res) => res.json())
        .then(setAvailability)
        .finally(() => setCheckingAvailability(false));
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [formData.date, formData.time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit reservation");
      }

      router.push("/reservations/confirmation");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-bold">
        <span className="text-neutral-900">Reserve</span>{" "}
        <span className="text-gold">a Table</span>
      </h1>
      <p className="mt-3 text-center text-neutral-600">
        Book your table in advance — instantly confirmed.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Date</label>
            <input
              type="date"
              name="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={formData.date}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Time</label>
            <input
              type="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Guests</label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              {Array.from({ length: MAX_PARTY_SIZE_ONLINE }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live availability feedback */}
        {formData.date && formData.time && (
          <div>
            {checkingAvailability ? (
              <p className="text-sm text-neutral-500">Checking availability...</p>
            ) : availability?.available ? (
              <p className="text-sm text-green-600">
                ✓ Available — {availability.remaining} seats left for this time
              </p>
            ) : availability && !availability.available ? (
              <p className="text-sm text-red-600">
                This time slot is fully booked. Please choose another time.
              </p>
            ) : null}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Special Requests <span className="text-neutral-400">(optional)</span>
          </label>
          <textarea
            name="specialRequests"
            rows={3}
            placeholder="Allergies, window seat, celebrating an occasion, etc."
            value={formData.specialRequests}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        <p className="text-xs text-neutral-500">
          Parties larger than {MAX_PARTY_SIZE_ONLINE} — please call us directly to book.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || (availability !== null && !availability.available)}
          className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-50"
        >
          {isSubmitting ? "Booking..." : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
}