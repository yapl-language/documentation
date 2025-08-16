---
title: Installation
description: How to install and set up YAPL in your project
---

# Installation

YAPL is available as a TypeScript/JavaScript library that can be used in both Node.js and browser environments, while the latter not makes much sense for most people.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

## Installation

Install YAPL using your preferred package manager:

```bash
# npm
npm install @yapl-language/yapl.ts

# yarn
yarn add @yapl-language/yapl.ts

# pnpm
pnpm add @yapl-language/yapl.ts
```

## Basic Setup

### Node.js Environment

For Node.js applications with file system access:

```typescript
import { NodeYAPL } from "@yapl-language/yapl.ts";

const yapl = new NodeYAPL({
  baseDir: "./prompts", // Directory containing your .yapl files
});

// Render a template file and pass your variables.
const result = await yapl.render("agent.md.yapl", {
  variable1: "Assistant",
  variable2: "customer support",
});

console.log(result.content);
```

### Browser Environment

For browser applications or when you don't need file system access:

```typescript
import { YAPL } from "@yapl-language/yapl.ts";

const yapl = new YAPL({
  baseDir: "/virtual", // Virtual base directory, is necessary to tell YAPL it's running in a Browser environment.
});

// Render template strings directly
const templateSource = `
Hello, {{ name | default("World") }}!
{% if greeting %}{{ greeting }}{% endif %}
`;

const result = await yapl.renderString(templateSource, {
  name: "YAPL User",
  greeting: "Welcome to YAPL!",
});

console.log(result.content);
```

## Configuration Options

### YAPLOptions

| Option        | Type                | Default   | Description                            |
| ------------- | ------------------- | --------- | -------------------------------------- |
| `baseDir`     | `string`            | Required  | Base directory for template files      |
| `cache`       | `boolean`           | `true`    | Enable file caching (Node.js only)     |
| `strictPaths` | `boolean`           | `true`    | Prevent path traversal outside baseDir |
| `maxDepth`    | `number`            | `20`      | Maximum template nesting depth         |
| `whitespace`  | `WhitespaceOptions` | See below | Whitespace control options             |

### WhitespaceOptions

| Option         | Type      | Default | Description                                  |
| -------------- | --------- | ------- | -------------------------------------------- |
| `trimBlocks`   | `boolean` | `true`  | Remove newlines after block tags             |
| `lstripBlocks` | `boolean` | `true`  | Remove leading whitespace before block tags  |
| `dedentBlocks` | `boolean` | `true`  | Remove common indentation from block content |

## Directory Structure

Organize your YAPL templates in a clear directory structure like this for example, but you can use any structure you like:

```
prompts/
├── base/
│   ├── system.md.yapl
│   └── agent.md.yapl
├── mixins/
│   ├── friendly.md.yapl
│   ├── professional.md.yapl
│   └── safety.md.yapl
├── agents/
│   ├── customer-support.md.yapl
│   ├── technical-writer.md.yapl
│   └── code-reviewer.md.yapl
└── tasks/
    ├── summarize.md.yapl
    ├── translate.md.yapl
    └── analyze.md.yapl
```

## File Extensions

YAPL templates can be written in many formats:

- `.yapl` - Pure YAPL templates
- `.md.yapl` - Markdown-based prompts with YAPL templating
- `.txt.yapl` - Plain text prompts with YAPL templating
- `.json.yapl` - JSON-structured prompts with YAPL templating

## VS Code Extension

For the best development experience, install the official YAPL VS Code extension:

[![Install VS Code Extension](https://img.shields.io/visual-studio-marketplace/v/EinfachAI.yapl?style=for-the-badge&logo=visual-studio-code&logoColor=white&label=VS%20Code%20Extension&color=007ACC)](https://marketplace.visualstudio.com/items?itemName=EinfachAI.yapl)

For VSCodium and other Open VSX compatible editors:

[![Install Open VSX Extension](https://img.shields.io/open-vsx/v/EinfachAI/yapl?style=for-the-badge&logo=vscodium&logoColor=white&label=Open%20VSX%20Extension&color=1E90FF)](https://open-vsx.org/extension/EinfachAI/yapl)

The extension provides:

- Syntax highlighting for `.yapl` files
- Snippets for common YAPL constructs
- IntelliSense support for YAPL syntax

## Next Steps

Now that you have YAPL installed, check out the [Quick Start](/documentation/quick-start/) guide to learn the basics, or dive into the [Core Features](/documentation/features/variables/) documentation to explore YAPL's capabilities.