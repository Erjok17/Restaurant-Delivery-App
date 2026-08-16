"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((user) =>
        setFormData({
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
        })
      )
      .catch(() => setStatus("error"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");

    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, phone: formData.phone }),
      });

      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-neutral-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
      <p className="mt-2 text-neutral-600">Update your personal details.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Full Name"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          disabled
          className="cursor-not-allowed bg-neutral-100 text-neutral-500"
        />
        <Input
          label="Phone"
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />

        {status === "saved" && (
          <p className="text-sm text-green-600">Profile updated successfully.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        )}

        <Button type="submit" variant="secondary" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}