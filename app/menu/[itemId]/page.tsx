"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
};

type ItemDetail = {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string | null;
  };
  reviews: Review[];
  averageRating: number | null;
  isLoggedIn: boolean;
  canReview: boolean;
  existingReview: { rating: number; comment: string } | null;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? "text-gold" : "text-neutral-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function MenuItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const { addItem, items } = useCart();

  const [data, setData] = useState<ItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const loadData = () => {
    fetch(`/api/menu/${itemId}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        if (result.existingReview) {
          setRating(result.existingReview.rating);
          setComment(result.existingReview.comment);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("saving");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId: itemId, rating, comment }),
      });

      if (!res.ok) throw new Error();
      setSubmitStatus("saved");
      loadData();
    } catch {
      setSubmitStatus("error");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-neutral-600">Item not found.</p>
        <Link href="/menu" className="mt-4 inline-block text-gold-dark hover:underline">
          Back to Menu
        </Link>
      </div>
    );
  }

  const { item, reviews, averageRating, isLoggedIn, canReview } = data;
  const alreadyInCart = items.some((i) => i.menuItemId === item.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/menu" className="text-sm text-neutral-500 hover:text-gold-dark">
        ← Back to Menu
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative h-72 w-full overflow-hidden rounded-2xl md:h-96">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-neutral-200" />
          )}
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
            {item.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">{item.name}</h1>

          {averageRating !== null && (
            <div className="mt-2 flex items-center gap-2">
              <Stars rating={Math.round(averageRating)} />
              <span className="text-sm text-neutral-500">
                {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <p className="mt-4 text-neutral-600">{item.description}</p>
          <p className="mt-4 text-2xl font-semibold text-gold-dark">${item.price}</p>

          <button
            onClick={() =>
              addItem({ menuItemId: item.id, name: item.name, price: item.price })
            }
            className="mt-6 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
          >
            {alreadyInCart ? "Add Another" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Review form */}
      <div className="mt-16 border-t border-neutral-200 pt-10">
        <h2 className="text-xl font-bold text-neutral-900">Leave a Review</h2>

        {!isLoggedIn ? (
          <p className="mt-3 text-neutral-600">
            <Link href="/account/login" className="text-gold-dark hover:underline">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        ) : !canReview ? (
          <p className="mt-3 text-neutral-600">
            You can review this dish once you&apos;ve ordered it.
          </p>
        ) : (
          <form onSubmit={handleReviewSubmit} className="mt-4 max-w-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Your Rating</label>
              <div className="mt-1 flex gap-1 text-2xl">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setRating(n)}
                    className={n <= rating ? "text-gold" : "text-neutral-300"}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">Your Review</label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {submitStatus === "error" && (
              <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
            )}
            {submitStatus === "saved" && (
              <p className="text-sm text-green-600">Thanks for your review!</p>
            )}

            <button
              type="submit"
              disabled={submitStatus === "saving"}
              className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-50"
            >
              {submitStatus === "saving" ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {/* Reviews list */}
      <div className="mt-12 border-t border-neutral-200 pt-10">
        <h2 className="text-xl font-bold text-neutral-900">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {reviews.length === 0 ? (
          <p className="mt-3 text-neutral-500">No reviews yet — be the first!</p>
        ) : (
          <div className="mt-4 space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-100 pb-6">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-neutral-900">{review.user.name}</p>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-2 text-neutral-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}