"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

type User = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
};

export default function AccountDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/users/me")
            .then((res) => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch(() => router.push("/account/login"))
            .finally(() => setIsLoading(false));
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-24 text-center">
                <p className="text-neutral-500">Loading your account...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-900">
                Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-2 text-neutral-600">{user.email}</p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Link
                    href="/account/profile"
                    className="rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-gold"
                >
                    <h3 className="font-semibold text-neutral-900">My Profile</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                        Update your name, email, and contact details.
                    </p>
                </Link>

                <Link
                    href="/account/orders"
                    className="rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-gold"
                >
                    <h3 className="font-semibold text-neutral-900">Order History</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                        View your past deliveries and reservations.
                    </p>
                </Link>

                <Link
                    href="/account/reservations"
                    className="rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-gold"
                >
                    <h3 className="font-semibold text-neutral-900">My Reservations</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                        View, manage, or cancel your table bookings.
                    </p>
                </Link>
            </div>

            <div className="mt-10 border-t border-neutral-200 pt-8">
                <Button onClick={handleLogout} variant="secondary">
                    Log Out
                </Button>
            </div>
        </div>
    );
}