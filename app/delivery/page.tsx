"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
};

export default function DeliveryPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { items, addItem } = useCart();

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setMenuItems);
  }, []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="text-neutral-900">Order</span>{" "}
            <span className="text-gold">Delivery</span>
          </h1>
          <p className="mt-2 text-neutral-600">
            Freshly made, delivered to your door.
          </p>
        </div>
        <Link
          href="/delivery/cart"
          className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white hover:bg-gold-dark"
        >
          Cart ({cartCount})
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 overflow-hidden rounded-2xl border border-neutral-200 p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="h-full w-full bg-neutral-200" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900">{item.name}</h3>
              <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
              <p className="mt-2 font-semibold text-gold-dark">${item.price}</p>
            </div>

            <button
              onClick={() =>
                addItem({ menuItemId: item.id, name: item.name, price: item.price })
              }
              className="shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}