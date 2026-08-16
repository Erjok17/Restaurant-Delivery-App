import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = ["picked_up", "on_the_way", "delivered"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "DRIVER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.driverId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const timestampField =
    status === "picked_up"
      ? { pickedUpAt: new Date() }
      : status === "delivered"
      ? { deliveredAt: new Date() }
      : {};

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status, ...timestampField },
  });

  return NextResponse.json({ success: true, order: updated });
}