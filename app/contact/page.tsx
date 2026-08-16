"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-bold">
        <span className="text-neutral-900">Contact</span> <span className="text-gold">Us</span>
      </h1>
      <p className="mt-3 text-center text-neutral-600">
        Questions, feedback, or private events — we'd love to hear from you.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Info */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-900">Address</h3>
            <p className="mt-1 text-neutral-600">123 Main Street, Your City</p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Phone</h3>
            <p className="mt-1 text-neutral-600">(555) 123-4567</p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Email</h3>
            <p className="mt-1 text-neutral-600">hello@bellacucina.com</p>
          </div>
          <div className="h-64 rounded-2xl bg-neutral-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
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
            <label className="block text-sm font-medium text-neutral-700">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {status === "sent" && (
            <p className="text-sm text-green-600">Message sent! We'll be in touch soon.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}