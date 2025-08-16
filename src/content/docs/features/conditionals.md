---
title: Conditionals
description: Learn how to use if/else statements and conditional logic in YAPL templates
---

# Conditionals

Conditionals allow you to include or exclude content based on runtime conditions, making your templates adaptive and context-aware. YAPL supports `if`, `else`, and nested conditional statements.

## Basic If Statements

### Simple Conditions

```yapl
{% if user_type == "premium" %}
  You have access to premium features.
{% endif %}

{% if show_examples %}
  Here are some examples:
  - Example 1
  - Example 2
{% endif %}
```

### If-Else Statements

```yapl
{% if difficulty == "beginner" %}
  I'll explain this in simple terms.
{% else %}
  I'll assume you're familiar with the basics.
{% endif %}
```

### If-ElseIf-Else Chains

```yapl
{% if user_level == "beginner" %}
  Let's start with the fundamentals.
{% elseif user_level == "intermediate" %}
  I'll cover the key concepts and some advanced topics.
{% else %}
  I'll focus on expert-level insights and edge cases.
{% endif %}
```

You can chain multiple `elseif` conditions:

```yapl
{% if score >= 90 %}
  Grade: A (Excellent!)
{% elseif score >= 80 %}
  Grade: B (Good work!)
{% elseif score >= 70 %}
  Grade: C (Satisfactory)
{% elseif score >= 60 %}
  Grade: D (Needs improvement)
{% else %}
  Grade: F (Please retry)
{% endif %}
```

## Condition Types

### Comparison Operators

YAPL supports various comparison operators for numeric and string comparisons:

```yapl
{# Equality comparisons #}
{% if status == "active" %}
  Active user
{% endif %}
{% if count == 0 %}
  No items
{% endif %}
{% if name != "guest" %}
  Welcome back!
{% endif %}

{# Numeric comparisons #}
{% if age >= 18 %}
  You are an adult
{% endif %}
{% if temperature > 30 %}
  It's hot today
{% endif %}
{% if score <= 60 %}
  Needs improvement
{% endif %}
{% if items < 5 %}
  Low inventory
{% endif %}

{# String comparisons work too #}
{% if version >= "2.0" %}
  New features available
{% endif %}
```

**Supported operators:**

- `==` - equals
- `!=` - not equals
- `>=` - greater than or equal
- `<=` - less than or equal
- `>` - greater than
- `<` - less than

### Boolean Values

```yapl
{% if is_premium %}
  Premium features enabled
{% endif %}
{% if debug_mode %}
  Debug information will be shown
{% endif %}
```

**Note:** YAPL doesn't support the `not` operator. Use comparison operators instead:

```yapl
{% if is_guest == false %}
  Welcome back!
{% endif %}
```

### Variable Existence

```yapl
{% if username is defined %}
Hello, {{ username }}!
{% else %}
Hello, guest!
{% endif %}

{% if optional_message is defined %}
{{ optional_message }}
{% endif %}

{# Check if variable is empty #}
{% if items is not empty %}
You have items in your list.
{% else %}
Your list is empty.
{% endif %}
```

### Logical Operators

Combine multiple conditions using logical operators:

```yapl
{# AND operator #}
{% if user.active and user.verified %}
Welcome, verified user!
{% endif %}

{# OR operator #}
{% if user.role == "admin" or user.role == "moderator" %}
You have elevated privileges.
{% endif %}

{# Complex combinations #}
{% if user.age >= 18 and user.country == "US" %}
You can vote in US elections.
{% elseif user.age >= 16 and user.country == "UK" %}
You can vote in UK elections.
{% endif %}
```

### Truthiness

```yapl
{% if skills %}
Your skills: {{ skills.0 }}{% if skills.1 %}, {{ skills.1 }}{% endif %}
{% else %}
No skills listed.
{% endif %}

{% if error_message %}
Error: {{ error_message }}
{% endif %}
```

### Multiple Conditions

YAPL supports logical `and` and `or` operators for combining conditions:

```yapl
{# AND operator #}
{% if user_type == "premium" and region == "US" %}
US Premium features available.
{% endif %}

{# OR operator #}
{% if user_type == "premium" or user_type == "admin" %}
Special content for privileged users.
{% endif %}

{# Complex combinations #}
{% if user.age >= 18 and user.verified and user.country == "US" %}
You can access age-restricted US content.
{% elseif user.age >= 16 and user.country == "UK" %}
You can access UK content for your age group.
{% endif %}
```

## Best Practices

### 1. Use Meaningful Condition Names

```yapl
<!-- Good -->
{% if user_has_premium_access %}
{% if feature_is_enabled %}
{% if debug_mode_active %}

<!-- Avoid -->
{% if flag1 %}
{% if x %}
{% if temp %}
```

### 2. Provide Fallbacks

```yapl
<!-- Good - handles undefined variables -->
{% if user_type is defined %}
  {% if user_type == "premium" %}
    Premium content
  {% else %}
    Standard content
  {% endif %}
{% else %}
  Default content
{% endif %}

<!-- Better - use defaults -->
{% if user_type | default("standard") == "premium" %}
Premium content
{% else %}
Standard content
{% endif %}
```

### 3. Keep Conditions Simple

```yapl
<!-- Good - simple, readable -->
{% if user_level == "expert" %}
  Advanced content here.
{% endif %}

<!-- Better - use elseif chains instead of deep nesting -->
{% if user_type == "premium" and region == "US" and feature_enabled and not maintenance_mode %}
  Premium US features available
{% elseif user_type == "premium" and region == "US" %}
  Premium US features temporarily unavailable
{% elseif user_type == "premium" %}
  Premium features available in your region
{% else %}
  Standard features available
{% endif %}
```

### 4. Document Complex Logic

```yapl
{# Show advanced features only for premium US users when feature is enabled #}
{% if user_type == "premium" %}
  {% if region == "US" %}
    {% if advanced_features_enabled %}
      Advanced features content...
    {% endif %}
  {% endif %}
{% endif %}
```

Conditionals make your YAPL templates dynamic and responsive to different contexts, user types, and runtime conditions. They're essential for creating adaptive AI prompts that can handle various scenarios effectively.
