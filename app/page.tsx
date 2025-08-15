"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const [keyName, setKeyName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [generatedKey, setGeneratedKey] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [testResponse, setTestResponse] = useState("");

  // generate API key
  const generateKey = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName || undefined }),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        setGeneratedKey(result.data.apiKey);
        setApiKey(result.data.apiKey);
      } else {
        toast.success(result.error);
      }
    } catch (error) {
      toast.error("Failed to generate API Key");
    } finally {
      setIsLoading(false);
    }
  };

  // test API endpoint
  const testApi = async (endpoint: string) => {
    if (!apiKey) return;

    try {
      const response = await fetch(`/api/test-api/${endpoint}`, {
        headers: { "x-api-key": apiKey },
      });

      const result = await response.json();
      setTestResponse(JSON.stringify(result, null, 2));
    } catch {
      setTestResponse("Failed to test API");
    }
  };

  return (
    <div className="bg-background relative min-h-screen py-8">
      {/* theme toggle */}
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-4xl px-4">
        {/* header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold">Free Fake API Services</h1>
          <p className="text-muted-foreground">
            A free and ready-to-use fake JSON API for testing and prototyping
            your applications.
          </p>
        </div>

        {/* generate API key */}
        <div className="mb-6 rounded-lg p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Generate API Key</h2>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              type="text"
              placeholder="Key name (optional)"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
            />
            <Button onClick={generateKey} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Key"}
            </Button>
          </div>

          {generatedKey && (
            <div className="rounded border bg-green-50 p-4 dark:bg-neutral-900">
              <p className="mb-2 text-green-800">
                Your API Key (Unlimited requests):
              </p>
              <code className="break-all text-green-700">{generatedKey}</code>
            </div>
          )}
        </div>

        {/* API key input */}
        <div className="mb-6 rounded-lg p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Test with API Key</h2>
          <Input
            type="text"
            placeholder="Enter your API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {/* test endpoints */}
        <div className="mb-6 rounded-lg p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Test Endpoints</h2>
          <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            <Button
              onClick={() => testApi("users")}
              disabled={!apiKey}
              variant="secondary"
            >
              Get All Users
            </Button>
            <Button
              onClick={() => testApi("user?id=1")}
              disabled={!apiKey}
              variant="secondary"
            >
              Get Single User
            </Button>
          </div>

          {testResponse && (
            <div className="rounded border p-3">
              <pre className="max-h-96 overflow-auto text-xs">
                {testResponse}
              </pre>
            </div>
          )}
        </div>

        {/* API documentation */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
          <h2 className="mb-4 text-xl font-semibold">API Documentation</h2>
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="text-foreground font-medium">Base URL:</h3>
              <code className="text-primary">
                {process.env.NEXT_PUBLIC_BASE_URL}/api/test-api/
              </code>
            </div>

            <div>
              <h3 className="text-foreground font-medium">Headers:</h3>
              <code className="text-primary">x-api-key: your_api_key_here</code>
            </div>

            <div>
              <h3 className="text-foreground font-medium">
                Available Endpoints:
              </h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1">
                <li>
                  <code>/users</code> - Get list of 50 fake users with detailed
                  information
                </li>
                <li>
                  <code>/user?id=1</code> - Get single user by ID (1-50)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
