"use client";

import { Input } from "@/components/ui/input";

export function ApiKeyInput({
  apiKey,
  setApiKey,
}: {
  apiKey: string;
  setApiKey: (v: string) => void;
}) {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Test with API Key</h2>
      <Input
        type="text"
        placeholder="Enter your API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
    </div>
  );
}
