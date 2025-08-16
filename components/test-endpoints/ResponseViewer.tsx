"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import duotoneLight from "react-syntax-highlighter/dist/esm/styles/prism/duotone-light";

import { useTheme } from "next-themes";

/**
 * Component to display API responses with syntax highlighting
 * and a copy-to-clipboard feature.
 */
export function ResponseViewer({ response }: { response: string }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  /**
   * Copy the response text to clipboard
   */
  const copyResponse = async () => {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success("Response copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  // Try to pretty-print JSON if possible
  let formattedResponse = response;
  try {
    formattedResponse = JSON.stringify(JSON.parse(response), null, 2);
  } catch {
    // Not JSON — leave as-is
  }

  return (
    <div className="bg-muted/50 relative mt-4 rounded-lg border p-3">
      {/* Copy button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-5 right-5 sm:top-6 sm:right-8"
        onClick={copyResponse}
      >
        {copied ? (
          <Check className="size-4 text-green-500" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>

      {/* Syntax highlighted response */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language="json"
          style={theme === "light" ? duotoneLight : vscDarkPlus}
          customStyle={{
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            background: theme === "light" ? "#fafafa" : "#27272a",
            maxHeight: "30rem",
            overflow: "auto",
            padding: "1rem",
            minWidth: "100%",
          }}
        >
          {formattedResponse}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
