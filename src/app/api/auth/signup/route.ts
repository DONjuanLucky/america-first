import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  zip: z.string().regex(/^\d{5}$/),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup details." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      zip: parsed.data.zip,
      passwordHash,
      preference: {
        create: {
          trackedIssues: ["Economy", "Healthcare", "Education"],
          trackedReps: ["NY-14 Representative", "State Senator District 23"],
          homeModules: ["brief", "queue", "signals"],
          justFacts: true,
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      zip: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
