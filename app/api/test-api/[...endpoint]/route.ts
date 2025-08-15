import prisma from "@/lib/db";
import { fakeUsers } from "@/lib/utils";
import { ApiResponse, userResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

async function validateApiKey(
  apiKey: string,
  endpoint: string,
  request: NextRequest,
) {
  // Find the API Key
  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey },
  });

  if (!keyRecord || !keyRecord.isActive) {
    return { valid: false, error: "Invalid or inactive API key" };
  }

  // Optional : log the request
  await prisma.requestLog
    .create({
      data: {
        apiKeyId: keyRecord.id,
        endpoint: endpoint,
        method: request.method,
      },
    })
    .catch(console.error); // Don't fail if logging fails

  return { valid: true };
}

async function handleRequest(
  request: NextRequest,
  { params }: { params: { endpoint: string[] } },
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
    const endpoint = params.endpoint.join("/");
    const validation = await validateApiKey(apiKey, endpoint, request);

    if (!validation.valid) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: validation.error,
        },
        { status: 401 },
      );
    }

    // handle different endpoints - only users now
    switch (endpoint) {
      case "users":
        const allUsers = fakeUsers();

        return NextResponse.json({
          success: true,
          data: allUsers,
        });

      case "user":
        // single user with query params support
        const url = new URL(request.url);
        const userId = url.searchParams.get("id") || "1";
        const users = fakeUsers();
        const user =
          users.find((user) => user.id === parseInt(userId)) || users[0];

        return NextResponse.json<userResponse>({
          success: true,
          data: user,
        });

      default:
        return NextResponse.json<ApiResponse<never>>(
          {
            success: false,
            error: `Endpoint '${endpoint} not found. Avaiable endpoints: users, user`,
          },
          { status: 404 },
        );
    }
  } catch (error) {}
}

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as PUT,
  handleRequest as DELETE,
};
