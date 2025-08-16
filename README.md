# <img src="https://raw.githubusercontent.com/yapl-language/yapl-vscode/refs/heads/main/images/icon.png" alt="YAPL" width="28" height="28" /> YAPL Documentation

The official documentation for YAPL (Yet Another Prompt Language) — a tiny, composable prompt templating language designed for AI agents.

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/yapl-language/yapl.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?logo=discord&logoColor=white)](https://discord.gg/R5CsJHxTeZ)

Quick links: [Website](https://yapl-language.github.io) · [Documentation](https://yapl-language.github.io/documentation) · [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=EinfachAI.yapl) · [NPM Package](https://www.npmjs.com/package/@yapl-language/yapl.ts) · [Discord](https://discord.gg/R5CsJHxTeZ)

## 📚 About the Documentation

This repository contains the official documentation for YAPL, built with [Starlight](https://starlight.astro.build/). The documentation covers all aspects of YAPL, from basic usage to advanced features.

If you're looking for information about YAPL itself, visit the [main documentation site](https://yapl-language.github.io/documentation).

## 🚀 Installation

To work on the documentation locally, you'll need to install the dependencies:

```bash
pnpm install
```

## 🧞 Commands

All commands are run from the root of the documentation project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |

## 📁 Project Structure

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Documentation pages are written as Markdown files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🛠️ Contributing to Documentation

We welcome contributions to improve the YAPL documentation! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b docs/improve-installation-guide`
3. Make your changes to the Markdown files in `src/content/docs/`
4. Test your changes locally: `pnpm dev`
5. Commit your changes: `git commit -m 'Improve installation guide'`
6. Push to the branch: `git push origin docs/improve-installation-guide`
7. Open a Pull Request

### Writing Guidelines

- Keep language clear and concise
- Use examples to illustrate concepts
- Follow the existing documentation structure
- Ensure code examples are accurate and tested
- Use proper Markdown formatting

## 📄 License

This documentation is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Resources

- [YAPL TypeScript Library](https://github.com/yapl-language/yapl.ts) - The core implementation
- [YAPL VS Code Extension](https://marketplace.visualstudio.com/items?itemName=EinfachAI.yapl) - Syntax highlighting and language support
- [YAPL Website](https://yapl-language.github.io) - Interactive playground and documentation

## 🐛 Issues & Support

- [GitHub Issues](https://github.com/yapl-language/yapl.ts/issues) - Documentation improvements and bug reports
- [Discord Community](https://discord.gg/R5CsJHxTeZ) - Get help and discuss YAPL