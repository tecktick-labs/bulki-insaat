import js from "@eslint/js";
import next from "eslint-config-next";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  globalIgnores([".next/**", ".firebase/**", "node_modules/**", "next-env.d.ts"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
]);

export default eslintConfig;
