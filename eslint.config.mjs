import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  globalIgnores(["dist/**", ".next/**", ".firebase/**", "node_modules/**"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
]);

export default eslintConfig;
