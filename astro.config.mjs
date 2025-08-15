// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: 'https://yapl-language.github.io',
  // base: '/documentation', // Commented out for local development
  integrations: [
    starlight({
      title: "YAPL Documentation",
      description:
        "Yet Another Prompt Language - A template language for AI prompts",
      logo: {
        src: "./src/assets/yapl-logo.svg",
        replacesTitle: false,
      },
      favicon: "/favicon.svg",
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
              fs.readFileSync(path.resolve(__dirname, 'src/grammars/yapl.tmLanguage.json'), 'utf-8')
            )
          ]
        },
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Installation", slug: "installation" },
            { label: "Introduction", slug: "installation"},
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
          label: "Examples",
          items: [
            { label: "Basic Prompts", slug: "examples/basic" },
            { label: "AI Agent Templates", slug: "examples/agents" },
            { label: "Complex Workflows", slug: "examples/workflows" },
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
          items: [
            { label: "Troubleshooting", slug: "troubleshooting" },
          ],
        },
      ],
    }),
  ],
});