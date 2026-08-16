import Link from "next/link";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSlideshow />

      {/* Featured Dishes */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-neutral-900">
          Featured Dishes
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-neutral-600">
          A taste of what's waiting for you on our menu.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDishes.map((dish) => (
            <div
              key={dish.name}
              className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm transition-shadow hover:shadow-md hover:border-gold"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {dish.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                  {dish.description}
                </p>
                <p className="mt-4 font-semibold text-gold-dark">
                  {dish.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
          >
            View Full Menu
          </Link>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-neutral-100">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            Ready to experience Bella Cucina?
          </h2>
          <p className="mt-3 text-neutral-600">
            Reserve your table today or place a delivery order in minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/reservations"
              className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
            >
              Make a Reservation
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-gold px-8 py-3 text-sm font-semibold text-gold-dark transition-colors hover:bg-gold hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const featuredDishes = [
  {
    name: "Margherita Pizza",
    description: "San Marzano tomatoes, fresh mozzarella, basil.",
    price: "$16",
    image: "/images/Margherita-Pizza.jpg",
  },
  {
    name: "Fettuccine Alfredo",
    description: "House-made pasta in a rich parmesan cream sauce.",
    price: "$18",
    image: "/images/Fettuccine-Alfredo.avif",
  },
  {
    name: "Tiramisu",
    description: "Espresso-soaked ladyfingers, mascarpone, cocoa.",
    price: "$9",
    image: "/images/Tiramisu.jpg",
  },
];