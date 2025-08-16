# Mixins

Mixins provide a way to compose templates from multiple sources, allowing you to combine different behaviors, traits, and capabilities without deep inheritance hierarchies. They follow the composition over inheritance principle.

## Basic Mixin Usage

### Defining a Mixin

Mixins are regular YAPL templates that define blocks:

`mixins/friendly.md.yapl`:

```yapl
{% block persona %}
    {{ super() }}
    You have a warm, friendly personality and enjoy helping users.
{% endblock %}

{% block communication_style %}
    {{ super() }}
    Use encouraging language and show enthusiasm for helping.
{% endblock %}
```

### Using Mixins

Use the `{% mixin %}` directive to include mixins in your template:

```yapl
{% extends "base/agent.md.yapl" %}
{% mixin "mixins/friendly.md.yapl" %}

{% block persona %}
    {{ super() }}
    You are a coding assistant.
{% endblock %}
```

## Multiple Mixins

You can include multiple mixins in a single template:

```yapl
{% extends "base/agent.md.yapl" %}
{% mixin "mixins/friendly.md.yapl", "mixins/safety.md.yapl", "mixins/professional.md.yapl" %}

{% block persona %}
    {{ super() }}
    You are a customer service representative.
{% endblock %}
```

### Mixin Order

Mixins are applied in the order they're listed. Later mixins can override earlier ones:

```yapl
{% mixin "mixins/casual.md.yapl", "mixins/professional.md.yapl" %}
{# professional.md.yapl will override any conflicting blocks from casual.md.yapl #}
```

## How Mixins Work

### Block Merging Process

1. **Base template** blocks are loaded first
2. **Mixin blocks** are merged in order, with `{{ super() }}` referring to previous content
3. **Child template blocks** are applied last, with `{{ super() }}` referring to the merged content

### Example Flow

Base template:

```yapl
{% block persona %}
    You are an AI assistant.
{% endblock %}
```

Mixin 1:

```yapl
{% block persona %}
    {{ super() }}
    You are helpful and knowledgeable.
{% endblock %}
```

Mixin 2:

```yapl
{% block persona %}
    {{ super() }}
    You have a professional demeanor.
{% endblock %}
```

Child template:

```yapl
{% extends "base.yapl" %}
{% mixin "mixin1.yapl", "mixin2.yapl" %}

{% block persona %}
    {{ super() }}
    You specialize in technical support.
{% endblock %}
```

Final result:

```
You are an AI assistant.
You are helpful and knowledgeable.
You have a professional demeanor.
You specialize in technical support.
```

## Best Practices

### 1. Keep Mixins Focused

```yapl
<!-- Good - focused on one concern -->
<!-- mixins/friendly-tone.md.yapl -->
{% block communication_style %}
{{ super() }}
Use warm, encouraging language.
{% endblock %}

<!-- Avoid - mixing multiple concerns -->
<!-- mixins/everything.md.yapl -->
{% block communication_style %}
    ...
{% endblock %}
{% block capabilities %}
    ...
{% endblock %}
{% block restrictions %}
    ...
{% endblock %}
```

### 2. Use Descriptive Names

```yapl
<!-- Good -->
{% mixin "mixins/safety-guidelines.md.yapl" %}
{% mixin "mixins/multilingual-support.md.yapl" %}

<!-- Avoid -->
{% mixin "mixins/stuff.md.yapl" %}
{% mixin "mixins/mixin1.md.yapl" %}
```

### 3. Document Mixin Purpose

```yapl
{#
Adds empathetic communication patterns for customer service scenarios.
Enhances persona and communication_style blocks.
#}
{% block persona %}
    {{ super() }}
    You show genuine empathy for customer concerns.
{% endblock %}
```

### 4. Consider Mixin Order

```yapl
<!-- Order matters - later mixins override earlier ones -->
{% mixin "mixins/casual-tone.md.yapl", "mixins/professional-tone.md.yapl" %}
{# professional-tone will override casual-tone #}
```

Mixins enable powerful composition patterns that make your templates more modular, reusable, and maintainable. They're particularly useful for creating families of related agents or adding cross-cutting concerns like safety, compliance, or personality traits.
