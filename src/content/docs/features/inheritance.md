---
title: Template Inheritance
description: Learn how to use template inheritance with extends and blocks in YAPL
---

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

Blocks define sections that can be overridden by child templates.

### Defining Blocks

```yapl
{% block block_name %}
Default content goes here.
{% endblock %}
```

### Block Names

Block names can contain letters, numbers, underscores, colons, and hyphens:

```yapl
{% block persona %}...{% endblock %}
{% block output-format %}...{% endblock %}
{% block task:instructions %}...{% endblock %}
{% block section_1 %}...{% endblock %}
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

### Wrapping Parent Content

```yapl
{% block persona %}
{{ super() }}
You also have a friendly, encouraging personality.
{% endblock %}
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

## Multi-level Inheritance

Templates can form inheritance chains:

### Base Template (`base/system.md.yapl`)
```yapl
# {{ title | default("AI System") }}

{% block persona %}
You are an AI assistant.
{% endblock %}

{% block capabilities %}
You can help with various tasks.
{% endblock %}

{% block guidelines %}
Be helpful and accurate.
{% endblock %}
```

### Intermediate Template (`base/agent.md.yapl`)
```yapl
{% extends "system.md.yapl" %}

{% block persona %}
{{ super() }}
You have a specific role and expertise.
{% endblock %}

{% block capabilities %}
{{ super() }}
You can engage in detailed conversations.
{% endblock %}

{% block interaction_style %}
You communicate clearly and professionally.
{% endblock %}
```

### Specialized Template (`agents/coder.md.yapl`)
```yapl
{% extends "../base/agent.md.yapl" %}

{% block persona %}
{{ super() }}
You are a programming expert specializing in {{ language | default("multiple languages") }}.
{% endblock %}

{% block capabilities %}
{{ super() }}
You can write, review, and debug code.
{% endblock %}

{% block interaction_style %}
{{ super() }}
You provide code examples and explain technical concepts clearly.
{% endblock %}
```

## Advanced Patterns

### Conditional Inheritance

While you can't conditionally extend templates, you can use variables to customize behavior:

```yapl
{% extends "base/system.md.yapl" %}

{% block persona %}
{% if agent_type == "creative" %}
You are a creative writing assistant with imagination and flair.
{% elif agent_type == "analytical" %}
You are an analytical assistant focused on data and logic.
{% else %}
{{ super() }}
{% endif %}
{% endblock %}
```

### Block Composition

Combine multiple concepts in a single block:

```yapl
{% block persona %}
{{ super() }}

{% if expertise %}
You specialize in {{ expertise }}.
{% endif %}

{% if personality %}
Your personality is {{ personality }}.
{% endif %}

{% if communication_style %}
You communicate in a {{ communication_style }} manner.
{% endif %}
{% endblock %}
```

### Template Families

Create families of related templates:

```
prompts/
├── base/
│   ├── system.md.yapl          # Root base
│   ├── agent.md.yapl           # Extends system
│   └── task.md.yapl            # Extends system
├── agents/
│   ├── customer-support.yapl   # Extends base/agent
│   ├── technical-writer.yapl   # Extends base/agent
│   └── code-reviewer.yapl      # Extends base/agent
└── tasks/
    ├── summarize.yapl          # Extends base/task
    ├── translate.yapl          # Extends base/task
    └── analyze.yapl            # Extends base/task
```

## Real-world Example

### Base Agent Template (`base/agent.md.yapl`)
```yapl
# {{ agent_name | default("AI Agent") }}

{% block persona %}
You are {{ agent_name | default("an AI assistant") }}.
{% endblock %}

{% block expertise %}
{% if domain %}
You have expertise in {{ domain }}.
{% endif %}
{% endblock %}

{% block communication_style %}
{% if tone %}
You communicate with a {{ tone }} tone.
{% endif %}
{% if formality %}
Your communication style is {{ formality }}.
{% endif %}
{% endblock %}

{% block capabilities %}
## Capabilities
- Answer questions
- Provide explanations
- Help with tasks
{% endblock %}

{% block guidelines %}
## Guidelines
- Be helpful and accurate
- Ask for clarification when needed
- Provide step-by-step guidance when appropriate
{% endblock %}

{% block output_format %}
## Output Format
{% if format %}
Respond in {{ format }} format.
{% else %}
Respond clearly and concisely.
{% endif %}
{% endblock %}
```

### Specialized Customer Support Agent
```yapl
{% extends "../base/agent.md.yapl" %}

{% block persona %}
{{ super() }}
You are a customer support specialist focused on helping users resolve issues quickly and effectively.
{% endblock %}

{% block capabilities %}
{{ super() }}
- Troubleshoot technical issues
- Process refunds and returns
- Escalate complex problems
- Provide product information
{% endblock %}

{% block guidelines %}
{{ super() }}
- Always remain patient and empathetic
- Gather necessary information before providing solutions
- Follow company policies for refunds and escalations
- Document interactions for follow-up
{% endblock %}

{% block interaction_protocol %}
## Interaction Protocol
1. Greet the customer warmly
2. Listen to their concern
3. Ask clarifying questions
4. Provide a solution or escalate
5. Confirm resolution
6. Offer additional assistance
{% endblock %}
```

## Best Practices

### 1. Keep Base Templates Generic
```yapl
<!-- Good - generic and reusable -->
{% block persona %}
You are an AI assistant.
{% endblock %}

<!-- Avoid - too specific for a base template -->
{% block persona %}
You are a Python programming expert who only helps with Django.
{% endblock %}
```

### 2. Use Meaningful Block Names
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

### 3. Document Block Purpose
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

### 4. Use Super Strategically
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