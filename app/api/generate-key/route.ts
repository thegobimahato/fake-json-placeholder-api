import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";

import { ApiKeyResponse } from "@/types/api";
import { generateApiKey } from "@/lib/utils";

// Schema for request validation
const createApiKeySchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    // Validate request body
    const parseResult = createApiKeySchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json<ApiKeyResponse>(
        { success: false, error: parseResult.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name } = parseResult.data;

    // Generate and insert unique API key with safety limit
    const MAX_ATTEMPTS = 5;
    let newApiKeyRecord = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const apiKey = generateApiKey();

      try {
        newApiKeyRecord = await prisma.apiKey.create({
          data: { key: apiKey, name: name || null },
        });
        break; // success — exit loop
      } catch (error: any) {
        if (error.code === "P2002") {
          // Unique constraint failed — retry
          continue;
        }
        throw error; // some other DB error
      }
    }

    if (!newApiKeyRecord) {
      return NextResponse.json<ApiKeyResponse>(
        { success: false, error: "Unable to generate a unique API key" },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiKeyResponse>({
      success: true,
      data: {
        apiKey: newApiKeyRecord.key,
        createdAt: newApiKeyRecord.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json<ApiKeyResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
