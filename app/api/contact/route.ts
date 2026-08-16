import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validators/contact.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const message = await prisma.contactMessage.create({ data });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid contact submission" },
      { status: 400 }
    );
  }
}