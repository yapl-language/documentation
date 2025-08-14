---
title: API Reference
description: Complete API reference for the YAPL TypeScript library
---

# API Reference

This page provides complete API documentation for the YAPL TypeScript library, including all classes, interfaces, and configuration options.

## Classes

### YAPL

Base YAPL class for browser environments or when file system access is not needed.

```typescript
import { YAPL } from 'yapl';

const yapl = new YAPL(options);
```

#### Constructor

```typescript
constructor(options: YAPLOptions)
```

#### Methods

##### renderString()

Render a template string with variables.

```typescript
async renderString(
  templateSource: string,
  vars?: Record<string, unknown>,
  currentDir?: string
): Promise<Prompt>
```

**Parameters:**
- `templateSource` - The YAPL template as a string
- `vars` - Variables to pass to the template (optional)
- `currentDir` - Directory to use for resolving relative includes (optional)

**Returns:** Promise resolving to a `Prompt` object

**Example:**
```typescript
const result = await yapl.renderString(
  'Hello, {{ name | default("World") }}!',
  { name: 'Alice' }
);
console.log(result.content); // "Hello, Alice!"
```

##### setBaseDir()

Update the base directory for template resolution.

```typescript
setBaseDir(dir: string): void
```

**Parameters:**
- `dir` - New base directory path

##### render()

⚠️ **Not available in base YAPL class.** Throws an error. Use `NodeYAPL` for file-based rendering.

```typescript
async render(templatePath: string, vars?: Record<string, unknown>): Promise<Prompt>
```

### NodeYAPL

Extended YAPL class with file system support for Node.js environments.

```typescript
import { NodeYAPL } from 'yapl';

const yapl = new NodeYAPL(options);
```

#### Constructor

```typescript
constructor(options: YAPLOptions)
```

#### Methods

Inherits all methods from `YAPL`, plus:

##### render()

Render a template file with variables.

```typescript
async render(templatePath: string, vars?: Record<string, unknown>): Promise<Prompt>
```

**Parameters:**
- `templatePath` - Path to template file (relative to baseDir)
- `vars` - Variables to pass to the template (optional)

**Returns:** Promise resolving to a `Prompt` object

**Example:**
```typescript
const result = await yapl.render('agents/coder.md.yapl', {
  language: 'TypeScript',
  experience: 'expert'
});
```

## Interfaces

### YAPLOptions

Configuration options for YAPL instances.

```typescript
interface YAPLOptions {
  baseDir: string;
  cache?: boolean;
  strictPaths?: boolean;
  maxDepth?: number;
  whitespace?: WhitespaceOptions;
}
```

**Properties:**

#### baseDir
- **Type:** `string`
- **Required:** Yes
- **Description:** Base directory for template files

#### cache
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Enable file caching (Node.js only)

#### strictPaths
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Prevent path traversal outside baseDir

#### maxDepth
- **Type:** `number`
- **Default:** `20`
- **Description:** Maximum template nesting depth

#### whitespace
- **Type:** `WhitespaceOptions`
- **Description:** Whitespace control configuration

### WhitespaceOptions

Configuration for whitespace handling.

```typescript
interface WhitespaceOptions {
  trimBlocks?: boolean;
  lstripBlocks?: boolean;
  dedentBlocks?: boolean;
}
```

**Properties:**

#### trimBlocks
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Remove newlines after block tags (`{% %}`)

#### lstripBlocks
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Remove leading whitespace before block tags

#### dedentBlocks
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Remove common indentation from block content

### Prompt

Result object returned by render methods.

```typescript
interface Prompt {
  content: string;
  usedFiles: string[];
}
```

**Properties:**

#### content
- **Type:** `string`
- **Description:** The rendered template content

#### usedFiles
- **Type:** `string[]`
- **Description:** Array of file paths used during rendering (includes, extends, mixins)

### Vars

Type alias for template variables.

```typescript
type Vars = Record<string, unknown>;
```

Variables can be any JSON-serializable values:
- Strings
- Numbers
- Booleans
- Objects
- Arrays
- null

### RendererOptions

Advanced configuration for the underlying renderer (typically not used directly).

```typescript
interface RendererOptions {
  baseDir?: string;
  strictPaths?: boolean;
  maxDepth?: number;
  whitespace?: WhitespaceOptions;
  resolvePath?: (templateRef: string, fromDir: string, ensureExt: (p: string) => string) => string;
  loadFile?: (absolutePath: string) => Promise<string>;
  ensureExtension?: (p: string) => string;
}
```

## Usage Examples

### Basic Setup

```typescript
import { NodeYAPL } from 'yapl';

const yapl = new NodeYAPL({
  baseDir: './prompts',
  cache: true,
  strictPaths: true,
  maxDepth: 10,
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true
  }
});
```

### Rendering Templates

```typescript
// Render from file
const fileResult = await yapl.render('agent.md.yapl', {
  name: 'CodeBot',
  language: 'Python'
});

// Render from string
const stringResult = await yapl.renderString(`
Hello, {{ name }}!
{% if role %}You are a {{ role }}.{% endif %}
`, {
  name: 'Assistant',
  role: 'helper'
});

console.log(fileResult.content);
console.log(fileResult.usedFiles); // ['./prompts/agent.md.yapl', ...]
```

### Error Handling

```typescript
try {
  const result = await yapl.render('nonexistent.yapl');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Template file not found');
  } else if (error.message.includes('Max template depth exceeded')) {
    console.error('Template recursion detected');
  } else if (error.message.includes('escapes baseDir')) {
    console.error('Path traversal attempt blocked');
  } else {
    console.error('Template rendering error:', error.message);
  }
}
```

### Dynamic Configuration

```typescript
// Create with minimal config
const yapl = new NodeYAPL({ baseDir: './prompts' });

// Update base directory
yapl.setBaseDir('./different-prompts');

// Render with custom whitespace for specific template
const customRenderer = new NodeYAPL({
  baseDir: './prompts',
  whitespace: {
    trimBlocks: false,
    lstripBlocks: false,
    dedentBlocks: true
  }
});
```

### Browser Usage

```typescript
import { YAPL } from 'yapl';

const yapl = new YAPL({ baseDir: '/virtual' });

// Only renderString is available in browser
const result = await yapl.renderString(templateString, variables);

// render() will throw an error
try {
  await yapl.render('template.yapl'); // Error!
} catch (error) {
  console.error(error.message); // "loadTemplateFile is not available in the browser"
}
```

### Advanced Variable Handling

```typescript
const complexVars = {
  user: {
    name: 'Alice',
    profile: {
      email: 'alice@example.com',
      preferences: {
        theme: 'dark',
        notifications: true
      }
    },
    roles: ['admin', 'developer']
  },
  config: {
    debug: true,
    version: '1.2.3'
  },
  features: ['feature1', 'feature2']
};

const result = await yapl.renderString(`
User: {{ user.name }}
Email: {{ user.profile.email }}
Theme: {{ user.profile.preferences.theme }}
First role: {{ user.roles.0 }}
Debug mode: {{ config.debug }}
`, complexVars);
```

### File Caching

```typescript
// Enable caching (default)
const cachedYapl = new NodeYAPL({
  baseDir: './prompts',
  cache: true
});

// Disable caching for development
const uncachedYapl = new NodeYAPL({
  baseDir: './prompts',
  cache: false
});

// First render loads from file system
await cachedYapl.render('template.yapl');

// Second render uses cached content
await cachedYapl.render('template.yapl'); // Faster!
```

### Path Security

```typescript
// Strict paths enabled (default)
const secureYapl = new NodeYAPL({
  baseDir: './prompts',
  strictPaths: true
});

try {
  // This will throw an error
  await secureYapl.render('../../../etc/passwd');
} catch (error) {
  console.error(error.message); // "Path escapes baseDir"
}

// Disable for special use cases (not recommended)
const unsecureYapl = new NodeYAPL({
  baseDir: './prompts',
  strictPaths: false
});
```

## Type Definitions

For TypeScript users, all types are exported:

```typescript
import {
  YAPL,
  NodeYAPL,
  YAPLOptions,
  WhitespaceOptions,
  Prompt,
  Vars,
  RendererOptions
} from 'yapl';
```

## Error Types

Common errors you might encounter:

### File System Errors
- `ENOENT` - Template file not found
- `EACCES` - Permission denied
- `EISDIR` - Path is a directory, not a file

### Template Errors
- `Max template depth exceeded` - Circular dependency or too deep nesting
- `Path escapes baseDir` - Attempted path traversal with strictPaths enabled
- `loadTemplateFile is not available in the browser` - Attempted file operation in browser environment

### Syntax Errors
- Template parsing errors for malformed YAPL syntax
- Missing `{% endif %}` or `{% endblock %}` tags
- Invalid variable names or expressions

This API reference covers all public interfaces of the YAPL library. For usage examples and patterns, see the [Examples](/examples/basic/) section.