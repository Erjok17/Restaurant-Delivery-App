"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "locating" | "done" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("done");
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          deliveryLat: coords?.lat ?? null,
          deliveryLng: coords?.lng ?? null,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error();

      clearCart();
      router.push(`/delivery/track/${result.order.id}`);
    } catch {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
      <p className="mt-2 text-neutral-600">Enter your delivery details to place your order.</p>

      <div className="mt-6 rounded-2xl border border-neutral-200 p-4">
        <p className="text-sm font-semibold text-neutral-900">Order Total: ${total.toFixed(2)}</p>
        <p className="mt-1 text-xs text-neutral-500">{items.length} item(s) in cart</p>
      </div>

      <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-4">
        <p className="text-sm font-medium text-neutral-900">Share your location for live tracking</p>
        <p className="mt-1 text-xs text-neutral-500">
          This lets you watch your driver's location in real time once your order is on the way.
        </p>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="mt-3 rounded-full border border-gold px-4 py-2 text-sm font-medium text-gold-dark transition-colors hover:bg-gold hover:text-white"
        >
          {locationStatus === "locating" ? "Locating..." : "Use My Current Location"}
        </button>
        {locationStatus === "done" && (
          <p className="mt-2 text-xs text-green-600">✓ Location captured</p>
        )}
        {locationStatus === "error" && (
          <p className="mt-2 text-xs text-red-600">
            Couldn't get your location. You can still order — tracking just won't be available.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input label="Full Name" id="name" name="name" required value={formData.name} onChange={handleChange} />
        <Input label="Email" id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
        <Input label="Delivery Address" id="address" name="address" required value={formData.address} onChange={handleChange} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="City" id="city" name="city" required value={formData.city} onChange={handleChange} />
          <Input label="Phone" id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting || items.length === 0} className="w-full">
          {isSubmitting ? "Placing order..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}