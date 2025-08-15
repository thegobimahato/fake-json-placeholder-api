"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponseViewer } from "./ResponseViewer";

export function TestEndpoints({ apiKey }: { apiKey: string }) {
  const [loading, setLoading] = useState({
    users: false,
    singleUser: false,
    randomUser: false,
  });
  const [lastClicked, setLastClicked] = useState<
    "users" | "singleUser" | "randomUser" | null
  >(null);
  const [testResponse, setTestResponse] = useState("");

  const testApi = async (
    endpoint: string,
    key: "users" | "singleUser" | "randomUser",
  ) => {
    if (!apiKey) return toast.error("Please enter an API key");

    setLoading((prev) => ({ ...prev, [key]: true }));
    setTestResponse("");
    setLastClicked(key);

    try {
      const response = await fetch(`/api/test-api/${endpoint}`, {
        headers: { "x-api-key": apiKey },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch data");
      }

      const result = await response.json();
      setTestResponse(JSON.stringify(result, null, 2));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setTestResponse(error.message || "Failed to test API");
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getRandomUserId = () => Math.floor(Math.random() * 50) + 1;

  const buttonClass = (key: keyof typeof loading) =>
    lastClicked === key ? "bg-indigo-600 text-white" : "";

  const isLoading = loading.users || loading.singleUser || loading.randomUser;

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Test Endpoints</h2>

      <div className="flex flex-col gap-2 md:flex-row">
        <Button
          onClick={() => testApi("users", "users")}
          disabled={!apiKey || loading.users}
          className={buttonClass("users")}
          variant="secondary"
        >
          Get All Users
        </Button>

        <Button
          onClick={() => testApi(`user?id=1`, "singleUser")}
          disabled={!apiKey || loading.singleUser}
          className={buttonClass("singleUser")}
          variant="secondary"
        >
          Get Single User
        </Button>

        <Button
          onClick={() => testApi(`user?id=${getRandomUserId()}`, "randomUser")}
          disabled={!apiKey || loading.randomUser}
          className={buttonClass("randomUser")}
          variant="secondary"
        >
          Get Random User
        </Button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          testResponse && <ResponseViewer response={testResponse} />
        )}
      </div>
    </div>
  );
}
