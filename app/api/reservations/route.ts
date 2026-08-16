import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reservationSchema } from "@/lib/validators/reservation.schema";
import { getSession } from "@/lib/auth";
import { CAPACITY_PER_SLOT } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = reservationSchema.parse({
      ...body,
      guests: Number(body.guests),
    });
    const session = await getSession();

    // Capacity check
    const existing = await prisma.reservation.findMany({
      where: {
        date: new Date(data.date),
        time: data.time,
        status: { not: "cancelled" },
      },
      select: { guests: true },
    });
    const bookedCovers = existing.reduce((sum: number, r: { guests: number }) => sum + r.guests, 0);

    if (bookedCovers + data.guests > CAPACITY_PER_SLOT) {
      return NextResponse.json(
        { success: false, error: "This time slot is fully booked. Please choose another time." },
        { status: 409 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: new Date(data.date),
        time: data.time,
        guests: data.guests,
        specialRequests: data.specialRequests || null,
        status: "confirmed",
        userId: session?.userId,
      },
    });

    return NextResponse.json({ success: true, reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid reservation submission" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reservations = await prisma.reservation.findMany({
    where: { userId: session.userId },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(reservations);
}