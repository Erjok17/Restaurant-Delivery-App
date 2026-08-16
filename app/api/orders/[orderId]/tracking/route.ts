import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { haversineDistanceKm, estimateEtaMinutes } from "@/lib/geo";
import { RESTAURANT_LOCATION, AVERAGE_DELIVERY_SPEED_KMH } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      location: true,
      driver: { select: { name: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.userId !== session.userId && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let distanceKm: number | null = null;
  let etaMinutes: number | null = null;

  if (order.location && order.deliveryLat && order.deliveryLng) {
    distanceKm = haversineDistanceKm(
      order.location.lat,
      order.location.lng,
      order.deliveryLat,
      order.deliveryLng
    );
    etaMinutes = estimateEtaMinutes(distanceKm, AVERAGE_DELIVERY_SPEED_KMH);
  }

  return NextResponse.json({
    status: order.status,
    driverName: order.driver?.name ?? null,
    driverLocation: order.location
      ? { lat: order.location.lat, lng: order.location.lng }
      : null,
    restaurant: RESTAURANT_LOCATION,
    destination:
      order.deliveryLat && order.deliveryLng
        ? { lat: order.deliveryLat, lng: order.deliveryLng }
        : null,
    distanceKm,
    etaMinutes,
    timestamps: {
      createdAt: order.createdAt,
      confirmedAt: order.confirmedAt,
      pickedUpAt: order.pickedUpAt,
      deliveredAt: order.deliveredAt,
    },
  });
}