import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "DRIVER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const available = await prisma.order.findMany({
    where: { status: "preparing", driverId: null },
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "asc" },
  });

  const mine = await prisma.order.findMany({
    where: {
      driverId: session.userId,
      status: { in: ["preparing", "picked_up", "on_the_way"] },
    },
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ available, mine });
}