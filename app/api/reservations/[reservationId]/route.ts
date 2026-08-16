import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { CANCELLATION_WINDOW_HOURS } from "@/lib/constants";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reservationId } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation || reservation.userId !== session.userId) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  if (reservation.status === "cancelled") {
    return NextResponse.json({ error: "Reservation is already cancelled" }, { status: 400 });
  }

  // Combine date + time into one Date object to check the cancellation window
  const [hours, minutes] = reservation.time.split(":").map(Number);
  const reservationDateTime = new Date(reservation.date);
  reservationDateTime.setHours(hours, minutes);

  const hoursUntilReservation =
    (reservationDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilReservation < CANCELLATION_WINDOW_HOURS) {
    return NextResponse.json(
      {
        error: `Reservations can only be cancelled at least ${CANCELLATION_WINDOW_HOURS} hours in advance. Please call us directly.`,
      },
      { status: 400 }
    );
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ success: true });
}