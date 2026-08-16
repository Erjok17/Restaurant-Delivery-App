import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators/review.schema";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "You must be logged in to leave a review" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = reviewSchema.parse(body);

    const purchase = await prisma.orderItem.findFirst({
      where: {
        menuItemId: data.menuItemId,
        order: { userId: session.userId },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "You can only review items you've purchased" },
        { status: 403 }
      );
    }

    const review = await prisma.review.upsert({
      where: {
        userId_menuItemId: { userId: session.userId, menuItemId: data.menuItemId },
      },
      update: { rating: data.rating, comment: data.comment },
      create: {
        rating: data.rating,
        comment: data.comment,
        userId: session.userId,
        menuItemId: data.menuItemId,
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid review submission" }, { status: 400 });
  }
}