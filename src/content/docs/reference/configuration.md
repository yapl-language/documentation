---
title: Configuration
description: Complete guide to configuring YAPL for different environments and use cases
---

# Configuration

This guide covers all aspects of configuring YAPL for different environments, use cases, and performance requirements.

## Basic Configuration

### Node.js Environment

```javascript
import { NodeYAPL } from '@yapl-language/yapl.ts';

const yapl = new NodeYAPL({
  baseDir: './prompts',
  cache: true,
  strictPaths: true,
  maxDepth: 20,
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true
  }
});
```

### Browser Environment

```javascript
import { YAPL } from '@yapl-language/yapl.ts';

const yapl = new YAPL({
  baseDir: '/virtual',
  maxDepth: 10,
  whitespace: {
    trimBlocks: true,
    lstripBlocks: false,
    dedentBlocks: true
  }
});
```

## Configuration Options

### baseDir

**Type:** `string` (required)  
**Description:** Base directory for template files

```javascript
// Absolute path
const yapl = new NodeYAPL({
  baseDir: '/home/user/prompts'
});

// Relative path (resolved from current working directory)
const yapl = new NodeYAPL({
  baseDir: './src/prompts'
});

// Dynamic path
const yapl = new NodeYAPL({
  baseDir: process.env.PROMPTS_DIR || './prompts'
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
  baseDir: './prompts',
  cache: true
});

// Disable caching (useful for development)
const yapl = new NodeYAPL({
  baseDir: './prompts',
  cache: false
});

// Environment-based caching
const yapl = new NodeYAPL({
  baseDir: './prompts',
  cache: process.env.NODE_ENV === 'production'
});
```

### strictPaths

**Type:** `boolean`  
**Default:** `true`

Prevents path traversal outside the base directory:

```javascript
// Secure (recommended)
const yapl = new NodeYAPL({
  baseDir: './prompts',
  strictPaths: true
});

// Allows path traversal (use with caution)
const yapl = new NodeYAPL({
  baseDir: './prompts',
  strictPaths: false
});
```

**Security implications:**
- `strictPaths: true` prevents templates from accessing files outside `baseDir`
- `strictPaths: false` allows `../` paths, which could be a security risk
- Always use `strictPaths: true` in production environments

### maxDepth

**Type:** `number`  
**Default:** `20`

Maximum template nesting depth to prevent infinite recursion:

```javascript
// Conservative limit
const yapl = new NodeYAPL({
  baseDir: './prompts',
  maxDepth: 5
});

// Higher limit for complex templates
const yapl = new NodeYAPL({
  baseDir: './prompts',
  maxDepth: 50
});

// Unlimited (not recommended)
const yapl = new NodeYAPL({
  baseDir: './prompts',
  maxDepth: Infinity
});
```

### whitespace

**Type:** `WhitespaceOptions`

Controls whitespace handling in templates:

```javascript
const yapl = new NodeYAPL({
  baseDir: './prompts',
  whitespace: {
    trimBlocks: true,      // Remove newlines after {% %} blocks
    lstripBlocks: true,    // Remove leading whitespace before blocks
    dedentBlocks: true     // Remove common indentation from blocks
  }
});
```

## Environment-Specific Configurations

### Development Environment

```javascript
const developmentConfig = {
  baseDir: './src/prompts',
  cache: false,              // Disable caching for live reloading
  strictPaths: true,         // Keep security enabled
  maxDepth: 10,              // Lower limit for faster debugging
  whitespace: {
    trimBlocks: false,       // Preserve formatting for debugging
    lstripBlocks: false,
    dedentBlocks: true
  }
};

const yapl = new NodeYAPL(developmentConfig);
```

### Production Environment

```javascript
const productionConfig = {
  baseDir: process.env.PROMPTS_DIR || '/app/prompts',
  cache: true,               // Enable caching for performance
  strictPaths: true,         // Security is critical
  maxDepth: 20,              // Reasonable limit
  whitespace: {
    trimBlocks: true,        // Clean output
    lstripBlocks: true,
    dedentBlocks: true
  }
};

const yapl = new NodeYAPL(productionConfig);
```

### Testing Environment

```javascript
const testConfig = {
  baseDir: './test/fixtures/prompts',
  cache: false,              // Ensure fresh reads for each test
  strictPaths: true,
  maxDepth: 5,               // Lower limit for faster tests
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true
  }
};

const yapl = new NodeYAPL(testConfig);
```

## Performance Optimization

### Caching Strategies

```javascript
// Single instance with caching (recommended)
const globalYapl = new NodeYAPL({
  baseDir: './prompts',
  cache: true
});

// Use the same instance throughout your application
export default globalYapl;
```

```javascript
// Multiple instances for different template sets
const agentYapl = new NodeYAPL({
  baseDir: './prompts/agents',
  cache: true
});

const taskYapl = new NodeYAPL({
  baseDir: './prompts/tasks',
  cache: true
});
```

### Memory Management

```javascript
// For high-volume applications, consider cache limits
class ManagedYAPL extends NodeYAPL {
  constructor(options) {
    super(options);
    this.cacheSize = 0;
    this.maxCacheSize = options.maxCacheSize || 100;
  }

  // Override loadFile to implement cache eviction
  async loadFile(path) {
    if (this.cacheSize > this.maxCacheSize) {
      this.fileCache.clear();
      this.cacheSize = 0;
    }
    
    const result = await super.loadFile(path);
    this.cacheSize++;
    return result;
  }
}
```

## Security Configuration

### Secure Production Setup

```javascript
const secureConfig = {
  baseDir: '/app/prompts',
  cache: true,
  strictPaths: true,         // Critical for security
  maxDepth: 10,              // Prevent DoS attacks
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true
  }
};

// Additional security measures
const yapl = new NodeYAPL(secureConfig);

// Validate base directory exists and is secure
import { access, constants } from 'fs/promises';
try {
  await access(secureConfig.baseDir, constants.R_OK);
} catch (error) {
  throw new Error(`Prompts directory not accessible: ${secureConfig.baseDir}`);
}
```

### Input Validation

```javascript
function createSecureYAPL(baseDir) {
  // Validate baseDir
  if (!baseDir || typeof baseDir !== 'string') {
    throw new Error('baseDir must be a non-empty string');
  }

  // Resolve and validate path
  const resolvedPath = path.resolve(baseDir);
  if (!resolvedPath.startsWith('/app/')) {
    throw new Error('baseDir must be within /app/ directory');
  }

  return new NodeYAPL({
    baseDir: resolvedPath,
    cache: true,
    strictPaths: true,
    maxDepth: 10
  });
}
```

## Advanced Configuration

### Custom File Resolution

```javascript
import { NodeYAPL } from '@yapl-language/yapl.ts';
import { YAPLRenderer } from '@yapl-language/yapl.ts';

const yapl = new NodeYAPL({
  baseDir: './prompts'
});

// Replace the renderer with custom resolution logic
yapl.renderer = new YAPLRenderer({
  baseDir: './prompts',
  resolvePath: (templateRef, fromDir, ensureExt) => {
    // Custom path resolution logic
    if (templateRef.startsWith('@/')) {
      // Handle alias paths
      return path.resolve('./prompts', templateRef.slice(2));
    }
    return path.resolve(fromDir, ensureExt(templateRef));
  },
  loadFile: async (absolutePath) => {
    // Custom file loading logic
    console.log(`Loading template: ${absolutePath}`);
    return await fs.readFile(absolutePath, 'utf8');
  }
});
```

### Dynamic Configuration

```javascript
class ConfigurableYAPL {
  constructor(baseConfig) {
    this.baseConfig = baseConfig;
    this.instances = new Map();
  }

  getInstance(overrides = {}) {
    const config = { ...this.baseConfig, ...overrides };
    const key = JSON.stringify(config);
    
    if (!this.instances.has(key)) {
      this.instances.set(key, new NodeYAPL(config));
    }
    
    return this.instances.get(key);
  }
}

const yaplFactory = new ConfigurableYAPL({
  baseDir: './prompts',
  cache: true,
  strictPaths: true
});

// Get instances with different configurations
const devYapl = yaplFactory.getInstance({ cache: false });
const prodYapl = yaplFactory.getInstance({ maxDepth: 50 });
```

## Configuration Validation

### Runtime Validation

```javascript
function validateConfig(config) {
  const errors = [];

  if (!config.baseDir) {
    errors.push('baseDir is required');
  }

  if (typeof config.maxDepth === 'number' && config.maxDepth < 1) {
    errors.push('maxDepth must be at least 1');
  }

  if (config.cache !== undefined && typeof config.cache !== 'boolean') {
    errors.push('cache must be a boolean');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(', ')}`);
  }
}

function createYAPL(config) {
  validateConfig(config);
  return new NodeYAPL(config);
}
```

### TypeScript Configuration

```typescript
import { NodeYAPL, YAPLOptions } from '@yapl-language/yapl.ts';

interface ExtendedYAPLOptions extends YAPLOptions {
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  timeout?: number;
}

class ExtendedYAPL extends NodeYAPL {
  private logLevel: string;
  private timeout: number;

  constructor(options: ExtendedYAPLOptions) {
    super(options);
    this.logLevel = options.logLevel || 'info';
    this.timeout = options.timeout || 30000;
  }

  async render(templatePath: string, vars = {}) {
    const startTime = Date.now();
    
    try {
      const result = await super.render(templatePath, vars);
      
      if (this.logLevel === 'debug') {
        console.log(`Rendered ${templatePath} in ${Date.now() - startTime}ms`);
      }
      
      return result;
    } catch (error) {
      if (this.logLevel !== 'error') {
        console.error(`Failed to render ${templatePath}:`, error.message);
      }
      throw error;
    }
  }
}
```

## Configuration Best Practices

### 1. Use Environment Variables

```javascript
const config = {
  baseDir: process.env.YAPL_BASE_DIR || './prompts',
  cache: process.env.NODE_ENV === 'production',
  strictPaths: process.env.YAPL_STRICT_PATHS !== 'false',
  maxDepth: parseInt(process.env.YAPL_MAX_DEPTH) || 20
};
```

### 2. Separate Configuration Files

```javascript
// config/yapl.js
export const yaplConfig = {
  development: {
    baseDir: './src/prompts',
    cache: false,
    strictPaths: true,
    maxDepth: 10
  },
  production: {
    baseDir: '/app/prompts',
    cache: true,
    strictPaths: true,
    maxDepth: 20
  },
  test: {
    baseDir: './test/fixtures',
    cache: false,
    strictPaths: true,
    maxDepth: 5
  }
};

// main.js
import { yaplConfig } from './config/yapl.js';
const config = yaplConfig[process.env.NODE_ENV] || yaplConfig.development;
const yapl = new NodeYAPL(config);
```

### 3. Configuration Validation

```javascript
import Joi from 'joi';

const configSchema = Joi.object({
  baseDir: Joi.string().required(),
  cache: Joi.boolean().default(true),
  strictPaths: Joi.boolean().default(true),
  maxDepth: Joi.number().integer().min(1).default(20),
  whitespace: Joi.object({
    trimBlocks: Joi.boolean().default(true),
    lstripBlocks: Joi.boolean().default(true),
    dedentBlocks: Joi.boolean().default(true)
  }).default()
});

function createValidatedYAPL(config) {
  const { error, value } = configSchema.validate(config);
  if (error) {
    throw new Error(`Invalid YAPL configuration: ${error.message}`);
  }
  return new NodeYAPL(value);
}
```

### 4. Monitoring and Logging

```javascript
class MonitoredYAPL extends NodeYAPL {
  constructor(options) {
    super(options);
    this.metrics = {
      renders: 0,
      cacheHits: 0,
      errors: 0
    };
  }

  async render(templatePath, vars) {
    this.metrics.renders++;
    
    try {
      const result = await super.render(templatePath, vars);
      return result;
    } catch (error) {
      this.metrics.errors++;
      throw error;
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }
}
```

This configuration guide covers all aspects of setting up YAPL for different environments and use cases. Choose the configuration options that best fit your specific requirements and security needs.