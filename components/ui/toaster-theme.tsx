"use client";

import { useTheme } from "next-themes";
import { Toaster } from "./sonner";

export default function ToasterTheme() {
  const { resolvedTheme } = useTheme();
  
  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      richColors
      closeButton
    />
  );
}
