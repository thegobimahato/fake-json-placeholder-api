"use client";

import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GenerateApiKey } from "@/components/api-key/GenerateApiKey";
import { ApiKeyInput } from "@/components/api-key/ApiKeyInput";
import { TestEndpoints } from "@/components/test-endpoints/TestEndpoints";
import { ApiDocumentation } from "@/components/documentation/ApiDocumentation";
import HeroSection from "@/components/ui/hero-section";

export default function Home() {
  const [apiKey, setApiKey] = useState("");

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey") || "";
    setApiKey(storedKey);
  }, []);

  return (
    <div className="from-background to-muted relative min-h-screen bg-gradient-to-b py-8">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-4">
        {/* Header */}
        <div className="py-8 text-center">
          <HeroSection />
        </div>

        <GenerateApiKey onKeyGenerated={(key) => setApiKey(key)} />
        <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
        <TestEndpoints apiKey={apiKey} />
        <ApiDocumentation currentApiKey={apiKey} />
      </div>
    </div>
  );
}
