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
  const { lat, lng } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.driverId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.deliveryLocation.upsert({
    where: { orderId },
    update: { lat, lng },
    create: { orderId, lat, lng },
  });

  return NextResponse.json({ success: true });
}