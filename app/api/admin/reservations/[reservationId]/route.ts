import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID = ["confirmed", "seated", "completed", "no-show", "cancelled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reservationId } = await params;
  const { status } = await req.json();

  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status },
  });

  return NextResponse.json({ success: true, reservation: updated });
}