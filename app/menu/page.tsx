"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
};

const categories = ["All", "Starters", "Mains", "Desserts", "Drinks"];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setMenuItems)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-bold">
        <span className="text-neutral-900">Our</span>{" "}
        <span className="text-gold">Menu</span>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-neutral-600">
        Crafted with fresh, seasonal ingredients — a taste of Italy in every dish.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-12 text-center text-neutral-500">Loading menu...</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.id}`}
              className="overflow-hidden rounded-2xl border border-neutral-200 transition-shadow hover:shadow-md hover:border-gold"
            >
              <div className="relative h-44 w-full overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-200" />
                )}
              </div>
              <div className="flex items-start justify-between p-6">
                <div>
                  <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                </div>
                <span className="ml-4 shrink-0 font-semibold text-gold-dark">
                  ${item.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}