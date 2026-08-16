import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CAPACITY_PER_SLOT } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  if (!date || !time) {
    return NextResponse.json({ error: "Date and time are required" }, { status: 400 });
  }

  const existingReservations = await prisma.reservation.findMany({
    where: {
      date: new Date(date),
      time,
      status: { not: "cancelled" },
    },
    select: { guests: true },
  });

  const bookedCovers = existingReservations.reduce((sum: number, r: { guests: number }) => sum + r.guests, 0);
  const remaining = CAPACITY_PER_SLOT - bookedCovers;

  return NextResponse.json({
    available: remaining > 0,
    remaining: Math.max(0, remaining),
  });
}