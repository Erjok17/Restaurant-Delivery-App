import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID = ["pending", "confirmed", "preparing", "cancelled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await params;
  const { status } = await req.json();

  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...(status === "confirmed" ? { confirmedAt: new Date() } : {}),
    },
  });

  return NextResponse.json({ success: true, order: updated });
}