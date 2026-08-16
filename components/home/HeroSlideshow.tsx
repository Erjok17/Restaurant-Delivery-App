"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/p1-1.jpg",
    heading: "Welcome to Bella Cucina",
    message: "Authentic Italian dining, made fresh every day.",
    cta: { label: "Explore", href: "/" },
  },
  {
    image: "/images/hero2.webp",
    heading: "Reserve Your Table",
    message: "Book ahead and skip the wait — we'll have it ready for you.",
    cta: { label: "Make a Reservation", href: "/reservations" },
  },
  {
    image: "/images/p4.jpg",
    heading: "Our Story",
    message: "Three generations of Italian tradition, brought to your table.",
    cta: { label: "About Us", href: "/about" },
  },
  {
    image: "/images/hero4-men.jpg",
    heading: "Crafted With Care",
    message: "Fresh, seasonal ingredients in every dish we serve.",
    cta: { label: "View Menu", href: "/menu" },
  },
  {
    image: "/images/hero5-del.avif",
    heading: "Delivered To Your Door",
    message: "Your favorite dishes, fresh and fast, wherever you are.",
    cta: { label: "Order Delivery", href: "/delivery" },
  },
  {
    image: "/images/p2-1.jpeg",
    heading: "We'd Love to Hear From You",
    message: "Questions, feedback, or private events — get in touch.",
    cta: { label: "Contact Us", href: "/contact" },
  },
];

const SLIDE_DURATION = 5000;

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex h-[80vh] min-h-125 items-center justify-center overflow-hidden bg-neutral-900 text-center text-white">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.heading}
            fill
            priority={index === 0}
            className={`object-cover ${index === activeIndex ? "animate-kenburns" : ""
              }`}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4">
        {slides.map((slide, index) => (
          <div
            key={slide.heading}
            className={`transition-opacity duration-1000 ${index === activeIndex
                ? "relative opacity-100 pointer-events-auto"
                : "absolute inset-0 opacity-0 pointer-events-none"
              }`}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {slide.heading.split(" ").map((word, i) =>
                i === slide.heading.split(" ").length - 1 ? (
                  <span key={i} className="text-gold">
                    {word}
                  </span>
                ) : (
                  `${word} `
                )
              )}
            </h1>
            <div className={`mx-auto mt-6 h-0.5 w-16 bg-gold`} />
            <p className="mt-6 text-lg text-neutral-300">{slide.message}</p>
            <div className="mt-10">
              <Link
                href={slide.cta.href}
                className="inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
              >
                {slide.cta.label}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-gold" : "w-2 bg-white/50"
              }`}
          />
        ))}
      </div>
    </section>
  );
}