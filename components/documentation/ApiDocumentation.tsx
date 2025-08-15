"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ApiDocumentationProps {
  currentApiKey: string; // receive the latest API key
}

export const ApiDocumentation = ({ currentApiKey }: ApiDocumentationProps) => {
  const { theme } = useTheme();
  const [copiedBaseUrl, setCopiedBaseUrl] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);

  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/test-api/`;
  const apiKey = currentApiKey || "your_api_key_here";

  const copyBaseUrl = async () => {
    await navigator.clipboard.writeText(baseUrl);
    setCopiedBaseUrl(true);
    toast.success("Base URL copied!");
    setTimeout(() => setCopiedBaseUrl(false), 1500);
  };

  const copyApiKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopiedApiKey(true);
    toast.success("API key copied!");
    setTimeout(() => setCopiedApiKey(false), 1500);
  };

  const bgClass = theme === "light" ? "bg-white" : "bg-muted/50";
  const borderClass =
    theme === "light" ? "border-gray-200" : "border-neutral-800";
  const textClass = theme === "light" ? "text-gray-800" : "text-gray-200";
  const codeBg = theme === "light" ? "bg-gray-100" : "bg-black/10";

  return (
    <div
      className={`relative rounded-xl border ${borderClass} p-6 shadow-sm ${bgClass}`}
    >
      <h2 className={`mb-4 text-lg font-semibold ${textClass}`}>
        API Documentation
      </h2>

      <div className="space-y-6 text-sm">
        {/* Base URL with copy button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <h3 className={`mb-1 font-medium sm:mb-0 ${textClass}`}>Base URL:</h3>
          <div className="flex w-full items-center gap-2 sm:flex-1">
            <code
              className={`flex-1 rounded-md px-2 py-1 font-mono ${codeBg} text-primary break-all`}
            >
              {baseUrl}
            </code>
            <Button size="icon" variant="ghost" onClick={copyBaseUrl}>
              {copiedBaseUrl ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Headers with copy button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <h3 className={`mb-1 font-medium sm:mb-0 ${textClass}`}>Headers:</h3>
          <div className="flex w-full items-center gap-2 sm:flex-1">
            <code
              className={`block flex-1 rounded-md px-2 py-1 font-mono ${codeBg} text-primary break-all`}
            >
              x-api-key: {apiKey}
            </code>
            <Button size="icon" variant="ghost" onClick={copyApiKey}>
              {copiedApiKey ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-1">
          <h3 className={`font-medium ${textClass}`}>Available Endpoints:</h3>
          <ul className={`list-inside list-disc space-y-1 ${textClass}`}>
            <li>
              <code className={`rounded-md px-1 py-0.5 font-mono ${codeBg}`}>
                /users
              </code>{" "}
              - Get a list of 50 fake users with detailed information
            </li>
            <li>
              <code className={`rounded-md px-1 py-0.5 font-mono ${codeBg}`}>
                /user?id=1
              </code>{" "}
              - Fetch a random user by ID (1-50)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
