"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Invalid email or password");

            router.push("/");
            router.refresh();
        } catch (err) {
            setError("Invalid email or password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-center text-3xl font-bold text-neutral-900">Welcome Back</h1>
            <p className="mt-2 text-center text-neutral-600">Log in to manage your account.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
                <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" variant="secondary" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-600">
                Don&apos;t have an account?{" "}
                <Link href="/account/register" className="font-semibold text-gold-dark hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}