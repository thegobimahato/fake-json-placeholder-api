import prisma from "@/lib/db";
import { generateApiKey } from "@/lib/utils";
import { ApiKeyResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name } = body;

    // Generate unique API Key
    let apiKey: string;
    let keyExists = true;

    do {
      apiKey = generateApiKey();
      const existing = await prisma.apiKey.findUnique({
        where: { key: apiKey },
      });

      keyExists = !!existing;
    } while (keyExists);

    // Create the API key
    const newApiKey = await prisma.apiKey.create({
      data: {
        key: apiKey,
        name: name || null,
      },
    });

    return NextResponse.json<ApiKeyResponse>({
      success: true,
      data: {
        apiKey: newApiKey.key,
        createdAt: newApiKey.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json<ApiKeyResponse>(
      {
        success: false,
        error: "Failed to generate API key",
      },
      { status: 500 },
    );
  }
}
