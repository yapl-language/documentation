# Template Inheritance

Template inheritance is one of YAPL's most powerful features, allowing you to create a hierarchy of templates where child templates can extend parent templates, inheriting their structure while customizing specific parts.

## Basic Inheritance

### Parent Template

Create a base template `base/system.md.yapl`:

```yapl
# System Prompt

{% block persona %}
    You are a helpful AI assistant.
{% endblock %}

{% block output_format %}
    Respond in markdown format.
{% endblock %}

{% block guidance %}
    Be concise and accurate.
{% endblock %}
```

### Child Template

Create a child template that extends the base:

```yapl
{% extends "base/system.md.yapl" %}

{% block persona %}
    You are a specialized coding assistant with expertise in {{ language | default("programming") }}.
{% endblock %}

{% block guidance %}
    {{ super() }}
    Always include code examples when relevant.
{% endblock %}
```

When rendered, the child template inherits the structure from the parent but overrides specific blocks.

## The `extends` Directive

The `{% extends %}` directive must be the first non-comment line in a template:

```yapl
{# This is a comment - OK before extends #}
{% extends "path/to/parent.yapl" %}

{# Everything else comes after extends #}
{% block content %}
    ...
{% endblock %}
```

### Path Resolution

Template paths are resolved relative to the current template's directory:

```
prompts/
├── base/
│   └── agent.md.yapl
├── specialized/
│   └── coder.md.yapl      # extends "../base/agent.md.yapl"
└── tasks/
    └── review.md.yapl     # extends "../base/agent.md.yapl"
```

## Blocks

Blocks define sections that can be overridden by child templates. Block names can contain letters, numbers, underscores, colons, and hyphens:

### Defining Blocks

```yapl
{% block block_name %}
    Default content goes here.
{% endblock %}
```

### Overriding Blocks

Child templates can completely replace block content:

```yapl
{% extends "base.yapl" %}

{% block persona %}
    You are a completely different assistant.
{% endblock %}
```

## The `super()` Function

Use `{{ super() }}` to include the parent block's content:

### Extending Parent Content

```yapl
# Parent template
{% block guidance %}
    - Be helpful
    - Be accurate
{% endblock %}

# Child template
{% block guidance %}
    {{ super() }}
    - Include code examples
    - Explain your reasoning
{% endblock %}
```

Result:

```
- Be helpful
- Be accurate
- Include code examples
- Explain your reasoning
```

### Conditional Super

```yapl
{% block guidance %}
    {% if include_base_guidance %}
        {{ super() }}
    {% endif %}
    Additional specific guidance here.
{% endblock %}
```

## Best Practices

### 1. Use Meaningful Block Names

```yapl
<!-- Good -->
{% block interaction_guidelines %}
{% block error_handling %}
{% block output_formatting %}

<!-- Avoid -->
{% block stuff %}
{% block content %}
{% block misc %}
```

### 2. Document Block Purpose

```yapl
{# Define the agent's core personality and role #}
{% block persona %}
    You are an AI assistant.
{% endblock %}

{# Specify what the agent can and cannot do #}
{% block capabilities %}
    You can help with various tasks.
{% endblock %}
```

### 3. Use Super Strategically

```yapl
<!-- Good - extends parent content -->
{% block guidelines %}
    {{ super() }}
    - Additional specific guideline
{% endblock %}

<!-- Good - replaces when needed -->
{% block persona %}
    You are a completely different type of assistant.
{% endblock %}
```

Template inheritance allows you to build sophisticated prompt hierarchies while maintaining clean, maintainable code. Combined with mixins and variables, it provides a powerful foundation for scalable prompt engineering.
