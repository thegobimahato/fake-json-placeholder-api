import prisma from "@/lib/db";
import { fakeUsers } from "@/lib/generateData";
import { ApiResponse, userResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

async function validateApiKey(
  apiKey: string,
  endpoint: string,
  request: NextRequest,
) {
  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey } });

  if (!keyRecord || !keyRecord.isActive) {
    return { valid: false, error: "Invalid or inactive API key" };
  }

  // Log request without blocking
  prisma.requestLog
    .create({
      data: {
        apiKeyId: keyRecord.id,
        endpoint,
        method: request.method,
      },
    })
    .catch(console.error);

  return { valid: true };
}

async function handleRequest(
  request: NextRequest,
  context: { params: Promise<{ endpoint: string[] }> },
) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "API key is required. Include it in the x-api-key header.",
        },
        { status: 401 },
      );
    }

    const resolvedParams = await context.params;
    const endpoint = resolvedParams.endpoint.join("/");

    const validation = await validateApiKey(apiKey, endpoint, request);
    if (!validation.valid) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: validation.error },
        { status: 401 },
      );
    }

    // Generate fake users once per request
    const users = fakeUsers();

    switch (endpoint) {
      case "users":
        return NextResponse.json<ApiResponse<typeof users>>({
          success: true,
          data: users,
        });

      case "user": {
        const url = new URL(request.url);
        const userId = parseInt(url.searchParams.get("id") || "1", 10);
        const user = users.find((u) => u.id === userId) || users[0];
        return NextResponse.json<userResponse>({
          success: true,
          data: user,
        });
      }

      default:
        return NextResponse.json<ApiResponse<never>>(
          {
            success: false,
            error: `Endpoint '${endpoint}' not found. Available endpoints: users, user`,
          },
          { status: 404 },
        );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as PUT,
  handleRequest as DELETE,
};
