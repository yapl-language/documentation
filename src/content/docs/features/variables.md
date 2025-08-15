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

## Whitespace Control

Control whitespace around variables using `-` modifiers:

```yapl
{{- name -}} (removes whitespace on both sides)
{{ name -}} (removes whitespace on the right)
{{- name }} (removes whitespace on the left)
```

Example:
```yapl
Hello,    {{- name -}}    !
```

With `name = "World"` becomes:
```
Hello,World!
```

## Advanced Examples

### AI Agent Configuration
```yapl
# {{ agent_name | default("AI Assistant") }}

You are {{ agent_name | default("an AI assistant") }} with expertise in {{ domain | default("general topics") }}.

## Personality
- Tone: {{ personality.tone | default("professional") }}
- Verbosity: {{ personality.verbosity | default("moderate") }}
- Formality: {{ personality.formality | default("balanced") }}

## Capabilities
{% if capabilities %}
Your main capabilities include:
{% for capability in capabilities %}
- {{ capability }}
{% endfor %}
{% else %}
You can help with a wide range of tasks and questions.
{% endif %}

## Context
{% if context.user_type %}
You are interacting with {{ context.user_type }} users.
{% endif %}
{% if context.session_goal %}
The goal of this session is: {{ context.session_goal }}
{% endif %}
```

### Dynamic Prompt Adaptation
```yapl
You are {{ role | default("a helpful assistant") }}.

{% if expertise_level == "expert" %}
You can use technical jargon and assume deep domain knowledge.
{% else %}
Explain concepts clearly and avoid unnecessary technical terms.
{% endif %}

{% if output_format %}
Format your responses as {{ output_format }}.
{% endif %}

{% if constraints %}
Additional constraints:
{% for constraint in constraints %}
- {{ constraint }}
{% endfor %}
{% endif %}

Your primary focus is {{ primary_focus | default("being helpful and accurate") }}.
```

### Multi-language Support
```yapl
{% if language == "spanish" %}
Hola, {{ name | default("usuario") }}. Soy tu asistente de IA.
{% elif language == "french" %}
Bonjour, {{ name | default("utilisateur") }}. Je suis votre assistant IA.
{% else %}
Hello, {{ name | default("user") }}. I am your AI assistant.
{% endif %}

{% if language %}
Please respond in {{ language }}.
{% endif %}
```

## Best Practices

### 1. Always Provide Defaults
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

## Common Patterns

### Configuration Objects
```yapl
{% if config.debug_mode %}
Debug mode is enabled.
{% endif %}

Timeout: {{ config.timeout | default(30) }} seconds
Max retries: {{ config.max_retries | default(3) }}
```

### Feature Flags
```yapl
{% if features.advanced_mode %}
Advanced features are available.
{% endif %}

{% if features.beta_features %}
Beta features are enabled - use with caution.
{% endif %}
```

### Environment-specific Content
```yapl
{% if environment == "development" %}
This is a development environment.
{% elif environment == "staging" %}
This is a staging environment.
{% else %}
This is a production environment.
{% endif %}
```

Variables are the building blocks of dynamic YAPL templates. Combined with other features like conditionals and inheritance, they enable you to create highly flexible and reusable prompt templates.