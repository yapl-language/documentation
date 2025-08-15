---
title: Syntax Reference
description: Complete reference for YAPL template syntax
---

# YAPL Syntax Reference

This page provides a complete reference for all YAPL syntax elements, including directives, variables, and control structures.

## Comments

Comments are ignored during template processing and don't appear in the output.

```yapl
{# This is a comment #}
{# 
Multi-line comment
can span several lines
#}
```

## Variables

### Basic Variable Interpolation

```yapl
{{ variable_name }}
{{ nested.property }}
{{ array.0 }}
```

### Default Values

```yapl
{{ variable | default("fallback value") }}
{{ variable | default('single quotes work too') }}
{{ number | default(42) }}
{{ boolean | default(true) }}
```

**Note:** YAPL only supports the `default()` function. Other filters like `upper`, `lower`, `join`, `length`, etc. are not supported.

### Whitespace Control

```yapl
{{- variable -}}    <!-- Remove whitespace on both sides -->
{{ variable -}}     <!-- Remove whitespace on the right -->
{{- variable }}     <!-- Remove whitespace on the left -->
```

## Directives

All directives use the `{% %}` syntax and support whitespace control with `-` modifiers.

### Template Inheritance

#### extends
```yapl
{% extends "path/to/parent.yapl" %}
{%- extends "path/to/parent.yapl" -%}
```

Must be the first non-comment directive in a template.

#### block
```yapl
{% block block_name %}
Content goes here
{% endblock %}

{%- block block_name -%}
Tight whitespace control
{%- endblock -%}
```

Block names can contain:
- Letters (a-z, A-Z)
- Numbers (0-9)
- Underscores (_)
- Hyphens (-)
- Colons (:)

Valid block names:
- `content`
- `main-section`
- `section_1`
- `nav:primary`
- `block123`

### Mixins

```yapl
{% mixin "path/to/mixin.yapl" %}
{% mixin "mixin1.yapl", "mixin2.yapl", "mixin3.yapl" %}
{%- mixin "path/to/mixin.yapl" -%}
```

### Includes

```yapl
{% include "path/to/template.yapl" %}
{% include "template.yapl" with {"key": "value"} %}
{% include "template.yapl" with {"name": "Alice", "age": 30, "active": true} %}
{%- include "template.yapl" -%}
```

### Conditionals

#### if/else/endif
```yapl
{% if condition %}
Content when true
{% endif %}

{% if condition %}
Content when true
{% else %}
Content when false
{% endif %}

{%- if condition -%}
Tight whitespace control
{%- endif -%}
```

#### Condition Types

**Equality:**
```yapl
{% if variable == "value" %}
{% if number == 42 %}
{% if boolean == true %}
```

**Variable existence:**
```yapl
{% if variable is defined %}
{% if variable is not defined %}
```

**Truthiness:**
```yapl
{% if variable %}          <!-- True if variable exists and is truthy -->
```

**Note:** The `not` operator is not supported. Use comparison operators instead: `{% if variable == false %}`

**Comparison with other variables:**
```yapl
{% if user_type == admin_type %}
{% if count == max_count %}
```

### Super Function

Access parent block content in inheritance and mixins:

```yapl
{% block content %}
{{ super() }}
Additional content
{% endblock %}

{# Whitespace control with super #}
{%- block content -%}
{{- super() -}}
Additional content
{%- endblock -%}
```

## Data Types

### Strings

```yapl
{{ "double quotes" }}
{{ 'single quotes' }}
{{ variable_containing_string }}
```

In `with` clauses and default values:
```yapl
{% include "template.yapl" with {"message": "Hello, world!"} %}
{{ name | default("Anonymous") }}
```

### Numbers

```yapl
{{ 42 }}
{{ 3.14159 }}
{{ variable_containing_number }}
```

In contexts:
```yapl
{{ age | default(18) }}
{{ price | default(9.99) }}
{% if count == 0 %}
```

### Booleans

```yapl
{{ true }}
{{ false }}
{{ variable_containing_boolean }}
```

In contexts:
```yapl
{{ is_active | default(true) }}
{% if is_premium == true %}
{% if not is_guest %}
```

### Objects

Access nested properties with dot notation:

```yapl
{{ user.name }}
{{ user.profile.email }}
{{ config.database.host }}
{{ settings.ui.theme }}
```

### Arrays

Access array elements by index:

```yapl
{{ items.0 }}          <!-- First item -->
{{ items.1 }}          <!-- Second item -->
{{ skills.0 }}         <!-- First skill -->
```

## Path Resolution

Template paths are resolved relative to the current template's directory:

```
prompts/
├── base/
│   └── system.yapl
├── agents/
│   └── coder.yapl          <!-- extends "../base/system.yapl" -->
└── components/
    └── header.yapl
```

### Relative Paths

```yapl
{% extends "../base/system.yapl" %}      <!-- Go up one directory -->
{% include "./components/header.yapl" %} <!-- Current directory -->
{% mixin "../../shared/mixins.yapl" %}   <!-- Go up two directories -->
```

### File Extensions

YAPL automatically adds `.yapl` extension if not specified:

```yapl
{% extends "base/system" %}              <!-- Resolves to base/system.yapl -->
{% include "header.md.yapl" %}           <!-- Uses exact filename -->
```

## Whitespace Control Rules

### Global Settings

Applied to all templates when configured:

```javascript
{
  trimBlocks: true,      // Remove newlines after {% %} blocks
  lstripBlocks: true,    // Remove leading whitespace before blocks
  dedentBlocks: true     // Remove common indentation from block content
}
```

### Manual Control

Override global settings for specific tags:

```yapl
{%- directive -%}      <!-- Remove whitespace on both sides -->
{% directive -%}       <!-- Remove whitespace on the right -->
{%- directive %}       <!-- Remove whitespace on the left -->

{{- variable -}}       <!-- Same rules apply to variables -->
{{ variable -}}
{{- variable }}
```

## Escaping and Special Characters

### Literal Braces

To output literal `{{` or `{%`, there's no built-in escaping. Use variables instead:

```yapl
{# Define in your variables #}
{{ open_brace }}{{ variable_name }}{{ close_brace }}

{# Where open_brace = "{{" and close_brace = "}}" #}
```

### Special Characters in Strings

In `with` clauses and default values, use standard JSON escaping:

```yapl
{% include "template.yapl" with {"message": "Line 1\nLine 2"} %}
{{ name | default("O'Reilly") }}
{{ path | default("C:\\Users\\Name") }}
```

## Error Handling

### Common Syntax Errors

**Missing endif:**
```yapl
{% if condition %}
Content
{# Missing {% endif %} - will cause an error #}
```

**Mismatched block names:**
```yapl
{% block content %}
Content
{% endblock different_name %}  {# Error: names don't match #}
```

**Invalid variable names:**
```yapl
{{ 123invalid }}     {# Error: can't start with number #}
{{ invalid-name }}   {# Error: hyphens not allowed in variable names #}
{{ invalid.123 }}    {# Error: property names can't start with numbers #}
```

**Extends not first:**
```yapl
{% block content %}Something{% endblock %}
{% extends "base.yapl" %}  {# Error: extends must be first #}
```

### Runtime Errors

**Undefined variables without defaults:**
```yapl
{{ undefined_variable }}  {# Results in empty string #}
```

**Path resolution errors:**
```yapl
{% extends "nonexistent/template.yapl" %}  {# File not found error #}
```

**Circular dependencies:**
```yapl
{# template1.yapl #}
{% include "template2.yapl" %}

{# template2.yapl #}
{% include "template1.yapl" %}  {# Circular dependency error #}
```

## Best Practices

### Naming Conventions

**Variables:**
```yapl
{{ user_name }}           <!-- snake_case for variables -->
{{ userProfile.email }}   <!-- camelCase for object properties -->
{{ is_active }}           <!-- boolean variables with is_ prefix -->
```

**Blocks:**
```yapl
{% block main_content %}     <!-- snake_case -->
{% block user-profile %}     <!-- kebab-case -->
{% block nav:primary %}      <!-- namespace with colon -->
```

**Files:**
```yapl
{% extends "base/agent.md.yapl" %}        <!-- descriptive names -->
{% include "components/header.yapl" %}    <!-- organized in directories -->
{% mixin "mixins/safety-guidelines.yapl" %}
```

### Template Organization

```yapl
{# 1. Comments and documentation first #}
{# 2. Extends directive (must be first non-comment) #}
{% extends "base/template.yapl" %}

{# 3. Mixin directives #}
{% mixin "mixins/behavior.yapl", "mixins/safety.yapl" %}

{# 4. Block definitions #}
{% block content %}
  {# 5. Includes and other directives #}
  {% include "components/header.yapl" %}
  
  {# 6. Template content #}
  Main content here
{% endblock %}
```

### Performance Considerations

**Efficient variable access:**
```yapl
{# Good - direct access #}
{{ user.name }}

{# Avoid - multiple property lookups #}
{{ user.profile.personal.name.first }}
```

**Minimize deep nesting:**
```yapl
{# Good - reasonable nesting #}
{% if condition1 %}
  {% if condition2 %}
    Content
  {% endif %}
{% endif %}

{# Avoid - too deeply nested #}
{% if a %}{% if b %}{% if c %}{% if d %}Content{% endif %}{% endif %}{% endif %}{% endif %}
```

This syntax reference covers all YAPL language features. For implementation details and usage examples, see the feature-specific documentation pages.