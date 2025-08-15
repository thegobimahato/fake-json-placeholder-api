"use client";

import { useState, useEffect } from "react";
import { Loader2, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

interface GenerateApiKeyProps {
  onKeyGenerated: (key: string) => void;
}

export function GenerateApiKey({ onKeyGenerated }: GenerateApiKeyProps) {
  const [keyName, setKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [generatedName, setGeneratedName] = useState("");
  const [copied, setCopied] = useState(false);

  // Load saved key & name
  useEffect(() => {
    const savedKey = localStorage.getItem("apiKey");
    const savedName = localStorage.getItem("apiKeyName");
    if (savedKey) setGeneratedKey(savedKey);
    if (savedName) setGeneratedName(savedName);
  }, []);

  const generateKey = async () => {
    setIsGenerating(true);
    try {
      const trimmedName = keyName.trim();
      const response = await fetch("/api/generate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName || undefined }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate key");
      }

      const result = await response.json();
      if (result.success && result.data?.apiKey) {
        const nameToSave = trimmedName || "Unnamed Key";
        setGeneratedKey(result.data.apiKey);
        setGeneratedName(nameToSave);

        localStorage.setItem("apiKey", result.data.apiKey);
        localStorage.setItem("apiKeyName", nameToSave);

        onKeyGenerated(result.data.apiKey);
        toast.success("API key generated successfully");
      } else {
        throw new Error(result.error || "Unknown error");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    toast.success("API key copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-card mx-auto w-full max-w-4xl rounded-xl border p-6 shadow-sm">
      <h2 className="mb-4 text-center text-lg font-semibold md:text-left">
        Generate API Key
      </h2>

      {/* Input & Generate Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          type="text"
          placeholder="Key name (optional)"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          className="w-full flex-1"
        />
        <Button
          onClick={generateKey}
          disabled={isGenerating}
          className="flex w-full items-center justify-center sm:w-auto"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? "Generating..." : "Generate Key"}
        </Button>
      </div>

      {/* Generated API Key Display */}
      {generatedKey && (
        <div className="bg-muted/30 mt-4 flex flex-col gap-2 overflow-x-auto rounded-lg border p-4">
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <p className="text-muted-foreground text-sm">API Name</p>
            <span className="font-medium break-words">{generatedName}</span>
          </div>

          <div className="mt-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div className="flex-1 overflow-x-auto">
              <p className="text-muted-foreground mb-1 text-sm">Your API Key</p>
              <code className="text-primary break-all">{generatedKey}</code>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="mt-2 sm:mt-0 sm:ml-2"
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
