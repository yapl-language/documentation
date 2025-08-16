# Includes

Includes allow you to break large templates into smaller, reusable components. This promotes modularity, reduces duplication, and makes templates easier to maintain.

## Basic Include Syntax

### Simple Includes

```yapl
{% include "components/header.md.yapl" %}

Main content goes here.

{% include "components/footer.md.yapl" %}
```

### Include with Variables

Pass variables to included templates using the `with` clause:

```yapl
{% include "components/user-greeting.md.yapl" with {"name": "Alice", "role": "admin"} %}
```

## How Includes Work

### Variable Scope

Included templates have access to:

1. Variables passed via the `with` clause
2. Variables from the parent template's scope
3. Variables passed via `with` override parent variables with the same name

### Example

Parent template:

```yapl
{# Parent has: name="Bob", role="user", company="ACME" #}
{% include "greeting.md.yapl" with {"name": "Alice"} %}
```

`greeting.md.yapl`:

```yapl
Hello {{ name }}! {# Uses "Alice" from with clause #}
You work at {{ company }}. {# Uses "ACME" from parent scope #}
Your role is {{ role }}. {# Uses "user" from parent scope #}
```

Result:

```
Hello Alice!
You work at ACME.
Your role is user.
```

## Best Practices

### 1. Keep Includes Focused

```yapl
<!-- Good - single responsibility -->
{% include "components/error-handling.md.yapl" %}
{% include "components/user-permissions.md.yapl" %}

<!-- Avoid - multiple responsibilities -->
{% include "components/everything.md.yapl" %}
```

### 2. Use Meaningful Parameters

```yapl
<!-- Good - clear parameter names -->
{% include "components/feature-toggle.md.yapl" with {
  "feature_name": "advanced_search",
  "is_enabled": true,
  "fallback_message": "Basic search is available"
} %}

<!-- Avoid - unclear parameters -->
{% include "components/feature-toggle.md.yapl" with {
  "name": "search",
  "flag": true,
  "msg": "fallback"
} %}
```

### 3. Document Include Interfaces

```yapl
{#
User greeting component

Parameters:
- user_name (string): Name to display in greeting
- user_role (string): User's role for role-specific messages
- show_last_login (boolean): Whether to show last login time
- custom_message (string, optional): Custom message to append

Example:
{% include "components/user-greeting.md.yapl" with {
  "user_name": "Alice",
  "user_role": "admin",
  "show_last_login": true
} %}
#}
```

Includes are essential for building maintainable, modular YAPL templates. They enable code reuse, improve organization, and make complex templates easier to understand and maintain.
