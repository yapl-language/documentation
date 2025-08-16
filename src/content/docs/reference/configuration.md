# Configuration

This guide covers configuring YAPL for different environments and use cases.

## Basic Configuration

### Node.js Environment

```javascript
import { NodeYAPL } from "@yapl-language/yapl.ts";

const yapl = new NodeYAPL({
  baseDir: "./prompts",
  cache: true,
  strictPaths: true,
  maxDepth: 20,
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true,
  },
});
```

### Browser Environment

```javascript
import { YAPL } from "@yapl-language/yapl.ts";

const yapl = new YAPL({
  baseDir: "/virtual",
  maxDepth: 20,
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true,
  },
  resolvePath: (templateRef, fromDir, ensureExt) => {
    // Custom path resolution logic
    return new URL(ensureExt(templateRef), fromDir).href;
  },
  loadFile: async (absolutePath) => {
    // Custom file loading logic
    const response = await fetch(absolutePath);
    return response.text();
  },
});
```

## Configuration Options

### baseDir

**Type:** `string` (required)  
**Description:** Base directory for template files

```javascript
// Absolute path
const yapl = new NodeYAPL({
  baseDir: "/home/user/prompts",
});

// Relative path
const yapl = new NodeYAPL({
  baseDir: "./src/prompts",
});
```

### cache

**Type:** `boolean`  
**Default:** `true`  
**Node.js only**

Controls file caching for better performance:

```javascript
// Enable caching (recommended for production)
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  cache: true,
});

// Disable caching (useful for development)
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  cache: false,
});
```

### strictPaths

**Type:** `boolean`  
**Default:** `true`  
**Node.js only**

Prevents path traversal outside the base directory:

```javascript
// Secure (recommended)
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  strictPaths: true,
});

// Allows path traversal (use with caution)
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  strictPaths: false,
});
```

**Security implications:**

- `strictPaths: true` prevents templates from accessing files outside `baseDir`
- Always use `strictPaths: true` in production environments

### maxDepth

**Type:** `number`  
**Default:** `20`

Maximum template nesting depth to prevent infinite recursion:

```javascript
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  maxDepth: 10, // Lower for simpler templates
});
```

### whitespace

**Type:** `WhitespaceOptions`

Controls whitespace handling in templates:

```javascript
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  whitespace: {
    trimBlocks: true, // Remove newlines after {% %} blocks
    lstripBlocks: true, // Remove leading whitespace before blocks
    dedentBlocks: true, // Remove common indentation from blocks
  },
});
```

### resolvePath

**Type:** `function`  
**Browser environments only**

Custom function to resolve template paths:

```javascript
const yapl = new YAPL({
  baseDir: "/virtual",
  resolvePath: (templateRef, fromDir, ensureExt) => {
    return new URL(ensureExt(templateRef), fromDir).href;
  },
});
```

### loadFile

**Type:** `function`  
**Browser environments only**

Custom function to load template files:

```javascript
const yapl = new YAPL({
  baseDir: "/virtual",
  loadFile: async (absolutePath) => {
    const response = await fetch(absolutePath);
    return response.text();
  },
});
```

## Environment-Specific Configurations

### Development Environment

```javascript
const developmentConfig = {
  baseDir: "./src/prompts",
  cache: false, // Disable caching for live reloading
  strictPaths: true,
  maxDepth: 10,
  whitespace: {
    trimBlocks: false, // Preserve formatting for debugging
    lstripBlocks: false,
    dedentBlocks: true,
  },
};

const yapl = new NodeYAPL(developmentConfig);
```

### Production Environment

```javascript
const productionConfig = {
  baseDir: "/app/prompts",
  cache: true,
  strictPaths: true,
  maxDepth: 20,
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true,
  },
};

const yapl = new NodeYAPL(productionConfig);
```

## Best Practices

### 1. Use Environment Variables

```javascript
const config = {
  baseDir: process.env.YAPL_BASE_DIR || "./prompts",
  cache: process.env.NODE_ENV === "production",
  strictPaths: process.env.YAPL_STRICT_PATHS !== "false",
  maxDepth: parseInt(process.env.YAPL_MAX_DEPTH) || 20,
};
```

### 2. Single Instance with Caching (recommended)

```javascript
// Single instance with caching
const globalYapl = new NodeYAPL({
  baseDir: "./prompts",
  cache: true,
});

// Use the same instance throughout your application
export default globalYapl;
```

This configuration guide covers the essential aspects of setting up YAPL. Choose the configuration options that best fit your specific requirements.
