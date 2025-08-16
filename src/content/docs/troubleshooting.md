# Troubleshooting

This guide covers common issues you might encounter when working with YAPL and how to resolve them.

## Installation Issues

### Package Not Found

**Error:**

```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/yapl
```

**Solution:**
Use the correct package name:

```bash
npm install @yapl-language/yapl.ts
```

### Import Errors

**Error:**

```typescript
Cannot find module 'yapl' or its corresponding type declarations
```

**Solution:**
Use the correct import:

```typescript
import { NodeYAPL } from "@yapl-language/yapl.ts";
```

## Template Syntax Errors

### Missing File Extensions

**Error:**

```
ENOENT: no such file or directory, open '/path/to/base/system'
```

**Problem:**

```yapl
{% extends "base/system" %}
```

**Solution:**
Always include file extensions:

```yapl
{% extends "base/system.md.yapl" %}
```

### Mismatched Block Tags

**Error:**

```
Template parsing error: Missing {% endif %}
```

**Problem:**

```yapl
{% if condition %}
  Content here
{# Missing {% endif %} #}
```

**Solution:**
Ensure all control structures are properly closed:

```yapl
{% if condition %}
  Content here
{% endif %}
```

### Invalid Block Names

**Error:**

```
Template parsing error: Invalid block name
```

**Problem:**

```yapl
{% block 123invalid %}
Content
{% endblock %}
```

**Solution:**
Use valid block names (letters, numbers, underscores, hyphens, colons):

```yapl
{% block valid_block_name %}
Content
{% endblock %}
```

## Runtime Errors

### Path Traversal Blocked

**Error:**

```
Error: Path escapes baseDir: ../../../etc/passwd
```

**Cause:**
Attempting to access files outside the configured `baseDir` with `strictPaths: true`.

**Solutions:**

1. **Use relative paths within baseDir:**

```yapl
{% extends "../base/system.md.yapl" %}  {# OK if within baseDir #}
```

2. **Disable strict paths (not recommended for production):**

```typescript
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  strictPaths: false,
});
```

3. **Adjust your baseDir:**

```typescript
const yapl = new NodeYAPL({
  baseDir: "./parent-directory", // Set higher in directory tree
  strictPaths: true,
});
```

### Maximum Depth Exceeded

**Error:**

```
Error: Max template depth exceeded (possible recursion).
```

**Cause:**
Circular dependencies or deeply nested templates.

**Common Causes:**

1. **Circular includes:**

```yapl
{# template1.yapl #}
{% include "template2.yapl" %}

{# template2.yapl #}
{% include "template1.yapl" %}  {# Circular! #}
```

2. **Self-referencing templates:**

```yapl
{# template.yapl #}
{% include "template.yapl" %}  {# Self-reference! #}
```

**Solutions:**

1. **Check for circular dependencies**
2. **Increase maxDepth if legitimately needed:**

```typescript
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  maxDepth: 50, // Default is 20
});
```

### For Loop Type Errors

**Error:**

```
Error: For loop iterable must be an array, got: string
```

**Problem:**

```yapl
{% for char in "hello" %}  {# String, not array #}
  {{ char }}
{% endfor %}
```

**Solution:**
Ensure you're iterating over arrays:

```yapl
{% for item in items %}  {# items must be an array #}
  {{ item }}
{% endfor %}
```

Or convert strings to arrays in your data:

```javascript
const data = {
  characters: "hello".split(""), // ["h", "e", "l", "l", "o"]
};
```

## File System Issues

### File Not Found

**Error:**

```
ENOENT: no such file or directory, open '/path/to/template.yapl'
```

**Debugging Steps:**

1. **Check file exists:**

```bash
ls -la /path/to/template.yapl
```

2. **Verify baseDir configuration:**

```typescript
console.log("Base directory:", yapl.baseDir);
```

3. **Check file permissions:**

```bash
ls -la /path/to/
```

4. **Use absolute paths for debugging:**

```typescript
const yapl = new NodeYAPL({
  baseDir: path.resolve("./prompts"), // Absolute path
});
```

### Permission Denied

**Error:**

```
EACCES: permission denied, open '/path/to/template.yapl'
```

**Solutions:**

1. **Check file permissions:**

```bash
chmod 644 /path/to/template.yapl
```

2. **Check directory permissions:**

```bash
chmod 755 /path/to/directory
```

3. **Run with appropriate user permissions**

## Variable Issues

### Undefined Variables

**Problem:**
Variables showing as empty in output.

**Debugging:**

```typescript
const result = await yapl.renderString("{{ missing_var }}", {});
console.log(result.content); // Empty string
```

**Solutions:**

1. **Use default values:**

```yapl
{{ missing_var | default("fallback value") }}
```

2. **Check variable names:**

```typescript
const data = {
  userName: "Alice", // camelCase
};

// This won't work:
// {{ user_name }}

// This will work:
// {{ userName }}
```

3. **Debug variable access:**

```yapl
{# Debug output #}
Available variables: {{ . }}
User name: {{ user.name }}
```

### Nested Property Access

**Problem:**

```yapl
{{ user.profile.email }}  {# Returns empty #}
```

**Debugging:**

```typescript
const data = {
  user: {
    profile: {
      email: "alice@example.com",
    },
  },
};

// Check data structure
console.log(JSON.stringify(data, null, 2));
```

**Common Issues:**

1. **Null/undefined in chain:**

```javascript
const data = {
  user: null, // This breaks user.profile.email
};
```

2. **Typos in property names:**

```javascript
const data = {
  user: {
    profil: {
      // Typo: should be "profile"
      email: "alice@example.com",
    },
  },
};
```

## Browser-Specific Issues

### File Loading Not Available

**Error:**

```
Error: File loading is not available. Provide a loadFile function in YAPLOptions or use renderString for browser usage.
```

**Problem:**

```typescript
import { YAPL } from "@yapl-language/yapl.ts";

const yapl = new YAPL({ baseDir: "/templates" });
await yapl.render("template.yapl"); // Error!
```

**Solution:**
Use `renderString` in browsers:

```typescript
import { YAPL } from "@yapl-language/yapl.ts";

const yapl = new YAPL({ baseDir: "/templates" });
const templateContent = await fetch("/templates/template.yapl").then((r) =>
  r.text()
);
const result = await yapl.renderString(templateContent, variables);
```

Or provide custom file loading:

```typescript
const yapl = new YAPL({
  baseDir: "/templates",
  loadFile: async (path) => {
    const response = await fetch(path);
    return response.text();
  },
  resolvePath: (templateRef, fromDir, ensureExt) => {
    return new URL(ensureExt(templateRef), fromDir).href;
  },
});
```

## Performance Issues

### Slow Template Rendering

**Symptoms:**

- Long render times
- High memory usage
- Timeouts

**Debugging:**

1. **Enable caching:**

```typescript
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  cache: true, // Enable file caching
});
```

2. **Profile template complexity:**

```typescript
console.time("render");
const result = await yapl.render("complex-template.yapl", data);
console.timeEnd("render");
```

3. **Check template depth:**

```typescript
console.log("Used files:", result.usedFiles.length);
```

**Solutions:**

1. **Reduce template nesting**
2. **Simplify complex conditionals**
3. **Break large templates into smaller pieces**
4. **Pre-process complex data structures**

### Memory Leaks

**Symptoms:**

- Increasing memory usage over time
- Out of memory errors

**Solutions:**

1. **Disable caching for development:**

```typescript
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  cache: false, // Disable for development
});
```

2. **Create new instances periodically:**

```typescript
// For long-running processes
let yapl = new NodeYAPL(options);

setInterval(() => {
  yapl = new NodeYAPL(options); // Fresh instance
}, 1000 * 60 * 60); // Every hour
```

## Debugging Techniques

### Enable Verbose Logging

```typescript
// Add debug output to templates
const debugTemplate = `
{# Debug info #}
Variables: {{ . }}
User: {{ user }}
Config: {{ config }}

{# Original template #}
${originalTemplate}
`;
```

### Inspect Rendered Output

```typescript
const result = await yapl.renderString(template, variables);

// Show exact output with whitespace
console.log("Content:", JSON.stringify(result.content));

// Show used files
console.log("Used files:", result.usedFiles);
```

### Test Templates in Isolation

```typescript
// Test individual components
const componentResult = await yapl.renderString(
  '{% include "components/header.yapl" %}',
  testData
);
```

### Validate Data Structures

```typescript
// Check data before rendering
function validateData(data) {
  console.log("Data structure:");
  console.log(JSON.stringify(data, null, 2));

  // Check for common issues
  if (data.user && !data.user.name) {
    console.warn("Warning: user.name is missing");
  }
}

validateData(templateData);
const result = await yapl.render("template.yapl", templateData);
```

## Getting Help

### Check the Documentation

1. [Syntax Reference](/reference/syntax/) - Complete syntax guide
2. [API Reference](/reference/api/) - Full API

### Common Resources

- **GitHub Issues**: Report bugs and request features
- **Discord Community**: Get help from other users
- **Stack Overflow**: Search for `yapl` tag

### Providing Bug Reports

When reporting issues, include:

1. **YAPL version:**

```bash
npm list @yapl-language/yapl.ts
```

2. **Minimal reproduction case:**

```typescript
import { NodeYAPL } from "@yapl-language/yapl.ts";

const yapl = new NodeYAPL({ baseDir: "./test" });
const result = await yapl.renderString("{{ test }}", { test: "value" });
console.log(result.content);
```

3. **Error messages and stack traces**
4. **Expected vs actual behavior**
5. **Environment details** (Node.js version, OS, etc.)

This troubleshooting guide should help you resolve most common issues with YAPL. If you encounter problems not covered here, please check the documentation or reach out to the community for help.
