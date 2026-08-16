import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validators/order.schema";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = orderSchema.parse(body);
    const session = await getSession();

    const total = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        city: data.city,
        phone: data.phone,
        total,
        userId: session?.userId,
        deliveryLat: body.deliveryLat ?? null,
        deliveryLng: body.deliveryLng ?? null,
        items: {
          create: data.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid order submission" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}