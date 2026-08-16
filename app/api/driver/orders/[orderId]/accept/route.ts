import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "DRIVER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.driverId) {
    return NextResponse.json({ error: "Order unavailable" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { driverId: session.userId },
  });

  return NextResponse.json({ success: true, order: updated });
}