"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Order Confirmed!</h1>
        <p className="mt-2 text-neutral-600">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button 
          href="/" 
          variant="secondary" 
          className="flex-1 sm:flex-none"
        >
          Back to Home
        </Button>
        <Button 
          href="/delivery" 
          variant="secondary" 
          className="flex-1 sm:flex-none"
        >
          View Menu
        </Button>
      </div>
    </div>
  );
}