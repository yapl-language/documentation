---
title: YAPL Syntax Test
description: Test page for YAPL syntax highlighting
---

# YAPL Syntax Highlighting Test

This page tests various YAPL syntax elements to verify highlighting is working correctly.

## Basic YAPL Example

```yapl title="basic-example.yapl"
{# This is a YAPL comment #}
{% extends "base/template.yapl" %}
{% mixin "mixins/helper.yapl" %}

{% block content %}
Hello, {{ name | default("World") }}!

{% if user_type == "premium" %}
You have premium access.
{% else %}
You have standard access.
{% endif %}

{{ super() }}
{% endblock %}
```

## Variables and Filters

```yapl title="variables.yapl"
{# Variable examples #}
{{ simple_variable }}
{{ nested.property }}
{{ array.0 }}
{{ variable | default("fallback") }}
{{ text | upper | trim }}
```

## Directives

```yapl title="directives.yapl"
{# Template inheritance #}
{% extends "parent.yapl" %}

{# Blocks #}
{% block header %}
Header content
{% endblock %}

{# Includes #}
{% include "partial.yapl" %}
{% include "component.yapl" with {"key": "value"} %}

{# Mixins #}
{% mixin "behavior.yapl", "style.yapl" %}

{# Conditionals #}
{% if condition %}
  Content when true
{% elif other_condition %}
  Alternative content
{% else %}
  Default content
{% endif %}
```

## Complex Example

```yapl title="complex-agent.yapl"
{# AI Agent Template with full YAPL features #}
{% extends "../base/system.md.yapl" %}
{% mixin "../mixins/safety.md.yapl", "../mixins/tone_friendly.md.yapl" %}

{% block persona %}
{{ super() }}
{% if role == "teacher" %}
You are an educational AI tutor specializing in {{ subject | default("general topics") }}.
{% if experience_level == "beginner" %}
You excel at breaking down complex topics into simple explanations.
{% endif %}
{% else %}
You are a general-purpose AI assistant.
{% endif %}
{% endblock %}

{% block capabilities %}
## Your Capabilities
{% if skills is defined %}
{% for skill in skills %}
- {{ skill.name }}: {{ skill.description }}
{% endfor %}
{% else %}
- Answer questions accurately
- Provide helpful explanations
- Assist with various tasks
{% endif %}
{% endblock %}

{% block guidelines %}
{{ super() }}
{% if strict_mode %}
- Follow all safety guidelines strictly
- Decline any inappropriate requests
{% endif %}

{% if user_preferences.detailed_explanations %}
- Provide detailed, step-by-step explanations
- Include examples and analogies
{% endif %}
{% endblock %}
```

## Fallback Test (Twig)

If YAPL highlighting isn't working, here's the same code with Twig highlighting:

```twig title="fallback-example.twig"
{# This uses Twig highlighting as fallback #}
{% extends "base/template.twig" %}

{% block content %}
Hello, {{ name | default("World") }}!

{% if user_type == "premium" %}
You have premium access.
{% else %}
You have standard access.
{% endif %}
{% endblock %}
```

## Expected Highlighting

The YAPL code blocks above should show:
- **Pink/Rose colors** for directives (`{% %}`) and variables (`{{ }}`)
- **Green colors** for strings (`"text"`, `'text'`)
- **Gray colors** for comments (`{# comment #}`)
- **Bold pink** for keywords (`extends`, `block`, `if`, `else`, `endif`, etc.)
- **Pink accents** for filters (`| default`, `| upper`)

## Verification

If the syntax highlighting is working correctly, you should see:
1. The YAPL logo "Y" indicator in the code block headers
2. Pink-themed syntax colors matching the YAPL brand
3. Proper token highlighting for all YAPL syntax elements

If you see plain text or generic highlighting, check the browser console for grammar loading errors.