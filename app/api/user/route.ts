import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const response = await prisma.user.findMany();
    if (response) {
      return NextResponse.json(response, { status: 201 });
    }
  } catch (error) {
    console.log(error);
  }
};
