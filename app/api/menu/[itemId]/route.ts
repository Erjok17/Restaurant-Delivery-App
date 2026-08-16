import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;

  const item = await prisma.menuItem.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const reviews = await prisma.review.findMany({
    where: { menuItemId: itemId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const averageRating =
  reviews.length > 0
    ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
    : null;

  const session = await getSession();
  let canReview = false;
  let existingReview = null;

  if (session) {
    const purchase = await prisma.orderItem.findFirst({
      where: {
        menuItemId: itemId,
        order: { userId: session.userId },
      },
    });
    canReview = !!purchase;

    existingReview = await prisma.review.findUnique({
      where: {
        userId_menuItemId: { userId: session.userId, menuItemId: itemId },
      },
    });
  }

  return NextResponse.json({
    item,
    reviews,
    averageRating,
    isLoggedIn: !!session,
    canReview,
    existingReview,
  });
}