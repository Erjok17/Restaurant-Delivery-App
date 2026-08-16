import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [todayReservations, pendingOrders, messagesCount, deliveredToday, newUsersToday] =
    await Promise.all([
      prisma.reservation.findMany({
        where: { date: { gte: startOfToday, lte: endOfToday }, status: { not: "cancelled" } },
      }),
      prisma.order.count({ where: { status: { in: ["pending", "confirmed", "preparing"] } } }),
      prisma.contactMessage.count(),
      prisma.order.findMany({
        where: { status: "delivered", deliveredAt: { gte: startOfToday, lte: endOfToday } },
      }),
      prisma.user.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
    ]);

  const totalGuestsToday = todayReservations.reduce((sum, r) => sum + r.guests, 0);
  const revenueToday = deliveredToday.reduce((sum, o) => sum + o.total, 0);

  return NextResponse.json({
    todayReservationsCount: todayReservations.length,
    totalGuestsToday,
    pendingOrders,
    messagesCount,
    revenueToday,
    newUsersToday,
  });
}