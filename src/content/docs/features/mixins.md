---
title: Mixins
description: Learn how to use mixins for template composition in YAPL
---

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

## Common Mixin Patterns

### Personality Mixins

`mixins/friendly.md.yapl`:
```yapl
{% block persona %}
{{ super() }}
You have a warm, approachable personality.
{% endblock %}

{% block communication_style %}
{{ super() }}
- Use encouraging language
- Show enthusiasm for helping
- Express empathy when appropriate
{% endblock %}
```

`mixins/professional.md.yapl`:
```yapl
{% block persona %}
{{ super() }}
You maintain a professional, business-appropriate demeanor.
{% endblock %}

{% block communication_style %}
{{ super() }}
- Use formal language
- Be concise and direct
- Focus on efficiency
{% endblock %}
```

### Capability Mixins

`mixins/code-expert.md.yapl`:
```yapl
{% block capabilities %}
{{ super() }}
- Write and review code
- Debug programming issues
- Explain programming concepts
- Suggest best practices
{% endblock %}

{% block guidelines %}
{{ super() }}
- Always include code examples when relevant
- Explain your reasoning
- Consider performance and security implications
{% endblock %}
```

`mixins/multilingual.md.yapl`:
```yapl
{% block capabilities %}
{{ super() }}
- Communicate in multiple languages
- Translate text accurately
- Explain cultural context
{% endblock %}

{% block guidelines %}
{{ super() }}
- Ask about preferred language if unclear
- Provide translations when helpful
- Be sensitive to cultural differences
{% endblock %}
```

### Safety and Compliance Mixins

`mixins/safety.md.yapl`:
```yapl
{% block guidelines %}
{{ super() }}
- Never provide harmful or dangerous information
- Decline inappropriate requests politely
- Prioritize user safety and well-being
- Report concerning behavior if necessary
{% endblock %}

{% block restrictions %}
## Restrictions
- No illegal activities
- No harmful content
- No personal information sharing
- No medical or legal advice
{% endblock %}
```

`mixins/privacy.md.yapl`:
```yapl
{% block guidelines %}
{{ super() }}
- Protect user privacy and confidentiality
- Don't store or remember personal information
- Ask before sharing information with third parties
{% endblock %}

{% block data_handling %}
## Data Handling
- Process only necessary information
- Don't retain personal data
- Respect user privacy preferences
{% endblock %}
```

## Advanced Mixin Techniques

### Conditional Mixins

While you can't conditionally include mixins, you can make mixin content conditional:

`mixins/adaptive-tone.md.yapl`:
```yapl
{% block communication_style %}
{{ super() }}
{% if user_type == "expert" %}
- Use technical terminology
- Be concise and direct
- Assume domain knowledge
{% else %}
- Use simple, clear language
- Provide detailed explanations
- Define technical terms
{% endif %}
{% endblock %}
```

### Parameterized Mixins

Use variables to customize mixin behavior:

`mixins/domain-expert.md.yapl`:
```yapl
{% block persona %}
{{ super() }}
{% if expertise_domain %}
You are an expert in {{ expertise_domain }}.
{% endif %}
{% endblock %}

{% block capabilities %}
{{ super() }}
{% if expertise_domain %}
- Provide {{ expertise_domain }}-specific guidance
- Answer advanced {{ expertise_domain }} questions
- Share {{ expertise_domain }} best practices
{% endif %}
{% endblock %}
```

### Mixin Composition

Create mixins that combine other mixins:

`mixins/customer-service-bundle.md.yapl`:
```yapl
{# This mixin combines multiple customer service traits #}
{% block persona %}
{{ super() }}
You are a customer service professional who is both helpful and efficient.
{% endblock %}

{% block communication_style %}
{{ super() }}
- Be patient and understanding
- Listen actively to concerns
- Provide clear solutions
- Follow up to ensure satisfaction
{% endblock %}

{% block problem_solving %}
## Problem Solving Approach
1. Listen and understand the issue
2. Ask clarifying questions
3. Provide step-by-step solutions
4. Verify the solution works
5. Offer additional assistance
{% endblock %}
```

## Real-world Example

### Base Agent
`base/support-agent.md.yapl`:
```yapl
# {{ company_name | default("Company") }} Support Agent

{% block persona %}
You are a customer support representative.
{% endblock %}

{% block capabilities %}
## Capabilities
- Answer product questions
- Help with account issues
- Process basic requests
{% endblock %}

{% block guidelines %}
## Guidelines
- Be helpful and responsive
- Follow company policies
{% endblock %}
```

### Mixins
`mixins/empathetic.md.yapl`:
```yapl
{% block persona %}
{{ super() }}
You show genuine empathy and understanding for customer concerns.
{% endblock %}

{% block communication_style %}
{{ super() }}
- Acknowledge customer feelings
- Use phrases like "I understand" and "I can help with that"
- Show patience with frustrated customers
{% endblock %}
```

`mixins/technical-support.md.yapl`:
```yapl
{% block capabilities %}
{{ super() }}
- Troubleshoot technical issues
- Guide users through complex procedures
- Escalate to engineering when needed
{% endblock %}

{% block guidelines %}
{{ super() }}
- Ask for specific error messages
- Request system information when relevant
- Provide step-by-step instructions
{% endblock %}
```

`mixins/billing-expert.md.yapl`:
```yapl
{% block capabilities %}
{{ super() }}
- Process refunds and billing adjustments
- Explain billing cycles and charges
- Handle subscription changes
{% endblock %}

{% block guidelines %}
{{ super() }}
- Verify account ownership before billing changes
- Explain all charges clearly
- Document all billing adjustments
{% endblock %}
```

### Composed Agent
`agents/premium-support.md.yapl`:
```yapl
{% extends "../base/support-agent.md.yapl" %}
{% mixin "../mixins/empathetic.md.yapl", "../mixins/technical-support.md.yapl", "../mixins/billing-expert.md.yapl" %}

{% block persona %}
{{ super() }}
You provide premium-level support with comprehensive technical and billing expertise.
{% endblock %}

{% block service_level %}
## Service Level
- Priority response times
- Comprehensive problem resolution
- Proactive follow-up
- Direct escalation paths
{% endblock %}
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
{% block communication_style %}...{% endblock %}
{% block capabilities %}...{% endblock %}
{% block restrictions %}...{% endblock %}
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

### 5. Use Super Consistently
```yapl
<!-- Good - always use super() to preserve composition -->
{% block guidelines %}
{{ super() }}
Additional guideline here.
{% endblock %}

<!-- Avoid - replaces all previous content -->
{% block guidelines %}
Only this guideline will appear.
{% endblock %}
```

Mixins enable powerful composition patterns that make your templates more modular, reusable, and maintainable. They're particularly useful for creating families of related agents or adding cross-cutting concerns like safety, compliance, or personality traits.