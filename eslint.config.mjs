import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", prettier),

  // Completely ignore generated Prisma files
  {
    files: ["app/generated/prisma/**/*.{ts,js}"],
    rules: {},
  },
];

export const ignorePatterns = ["app/generated/prisma/**/*"];

export default eslintConfig;
