// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: "https://yapl-language.github.io",
  base: "/documentation",
  integrations: [
    starlight({
      title: "YAPL Documentation",
      description:
        "Yet Another Prompt Language - A template language for AI prompts",
      logo: {
        src: "./public/yapl-logo.png",
        replacesTitle: false,
      },
      favicon: "/favicon.png",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/yapl-language/yapl.ts",
        },
        {
          icon: "external",
          label: "Website",
          href: "https://yapl-language.github.io",
        },
      ],
      customCss: ["./src/styles/custom.css"],
      components: {
        Footer: "./src/components/Footer.astro",
      },
      expressiveCode: {
        // Keep custom YAPL language support but otherwise use Starlight defaults
        shiki: {
          langs: [
            // Load YAPL grammar following Starlight's recommended approach
            JSON.parse(
              fs.readFileSync(
                path.resolve(__dirname, "src/grammars/yapl.tmLanguage.json"),
                "utf-8"
              )
            ),
          ],
        },
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "introduction" },
            { label: "Installation", slug: "installation" },
            { label: "Quick Start", slug: "quick-start" },
          ],
        },
        {
          label: "Core Features",
          items: [
            { label: "Variables", slug: "features/variables" },
            { label: "Template Inheritance", slug: "features/inheritance" },
            { label: "Mixins", slug: "features/mixins" },
            { label: "Conditionals", slug: "features/conditionals" },
            { label: "For Loops", slug: "features/loops" },
            { label: "Includes", slug: "features/includes" },
            { label: "Whitespace Control", slug: "features/whitespace" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Syntax Reference", slug: "reference/syntax" },
            { label: "API Reference", slug: "reference/api" },
            { label: "Configuration", slug: "reference/configuration" },
          ],
        },
        {
          label: "Help",
          items: [{ label: "Troubleshooting", slug: "troubleshooting" }],
        },
      ],
    }),
  ],
});
