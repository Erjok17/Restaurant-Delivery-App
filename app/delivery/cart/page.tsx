"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-neutral-600">Your cart is empty.</p>
          <Button href="/delivery" variant="secondary" className="mt-6 inline-block">
            Browse Menu
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 p-6"
              >
                <div>
                  <p className="font-semibold text-neutral-900">{item.name}</p>
                  <p className="mt-1 text-sm text-neutral-600">${item.price} each</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, -1)}
                      className="h-8 w-8 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, 1)}
                      className="h-8 w-8 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                  <p className="w-16 text-right font-semibold text-gold-dark">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.menuItemId)}
                    className="text-sm text-neutral-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
            <p className="text-lg font-semibold text-neutral-900">Total</p>
            <p className="text-lg font-semibold text-gold-dark">${total.toFixed(2)}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/delivery"
              className="flex-1 rounded-full border border-gold px-6 py-3 text-center text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-white"
            >
              Continue Shopping
            </Link>
            <Link
              href="/delivery/checkout"
              className="flex-1 rounded-full bg-gold py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}