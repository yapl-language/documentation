---
title: Variables
description: Learn how to use variables and default values in YAPL templates
---

# Variables

Variables are the foundation of dynamic templates in YAPL. They allow you to create flexible prompts that can be customized at render time without modifying the template itself.

## Basic Variable Syntax

Variables in YAPL use double curly braces `{{ }}`:

```yapl
Hello, {{ name }}!
You are working on {{ project }}.
```

When rendered with variables:
```javascript
const result = await yapl.renderString(template, {
  name: 'Alice',
  project: 'YAPL Documentation'
});
```

Output:
```
Hello, Alice!
You are working on YAPL Documentation.
```

## Default Values

Variables can have default values using the `default()` function:

```yapl
Hello, {{ name | default("World") }}!
Your role is {{ role | default("assistant") }}.
```

If no value is provided for a variable, the default is used:

```javascript
// With values
await yapl.renderString(template, { name: 'Bob', role: 'developer' });
// Output: Hello, Bob! Your role is developer.

// Without values (uses defaults)
await yapl.renderString(template, {});
// Output: Hello, World! Your role is assistant.

// Partial values
await yapl.renderString(template, { name: 'Charlie' });
// Output: Hello, Charlie! Your role is assistant.
```

**Note:** YAPL only supports the `default()` function for providing fallback values. Other template filters like `upper`, `lower`, `join`, or `length` are not supported.

## Nested Object Access

Access nested object properties using dot notation:

```yapl
Welcome {{ user.name }}!
Your email is {{ user.contact.email }}.
You have {{ user.stats.points }} points.
```

With data:
```javascript
const data = {
  user: {
    name: 'Alice',
    contact: {
      email: 'alice@example.com'
    },
    stats: {
      points: 1250
    }
  }
};

await yapl.renderString(template, data);
```

Output:
```
Welcome Alice!
Your email is alice@example.com.
You have 1250 points.
```

## Variable Types

YAPL supports various data types:

### Strings
```yapl
Name: {{ name }}
Description: {{ description | default("No description provided") }}
```

### Numbers
```yapl
Age: {{ age }}
Score: {{ score | default(0) }}
Price: ${{ price | default(9.99) }}
```

### Booleans
```yapl
{% if is_premium %}Premium user{% else %}Standard user{% endif %}
Active: {{ is_active | default(true) }}
```

### Arrays
While you can't directly interpolate arrays, you can access array elements:

```yapl
First skill: {{ skills.0 }}
Second skill: {{ skills.1 }}
```

Or use them in conditionals:
```yapl
{% if skills %}
You have skills: {{ skills.0 }}{% if skills.1 %}, {{ skills.1 }}{% endif %}
{% endif %}
```

## Best Practices

### 1. Provide Defaults
```yapl
<!-- Good -->
Hello, {{ name | default("there") }}!

<!-- Avoid - could result in empty output -->
Hello, {{ name }}!
```

### 2. Use Descriptive Variable Names
```yapl
<!-- Good -->
{{ user_experience_level | default("beginner") }}
{{ preferred_communication_style | default("friendly") }}

<!-- Avoid -->
{{ level | default("beginner") }}
{{ style | default("friendly") }}
```

### 3. Group Related Variables
```javascript
// Good - organized structure
const variables = {
  user: {
    name: 'Alice',
    level: 'expert',
    preferences: {
      tone: 'professional',
      detail: 'high'
    }
  },
  task: {
    type: 'code_review',
    language: 'typescript',
    complexity: 'medium'
  }
};
```

### 4. Document Expected Variables
```yapl
{# 
Expected variables:
- agent_name (string): Name of the AI agent
- domain (string): Area of expertise  
- user_level (string): "beginner" | "intermediate" | "expert"
- include_examples (boolean): Whether to include examples
#}

# {{ agent_name | default("AI Assistant") }}
```


Variables are the building blocks of dynamic YAPL templates. Combined with other features like conditionals and inheritance, they enable you to create highly flexible and reusable prompt templates.