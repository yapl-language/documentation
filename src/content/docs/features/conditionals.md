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

### If-Elif-Else Chains

```yapl
{% if user_level == "beginner" %}
Let's start with the fundamentals.
{% elif user_level == "intermediate" %}
I'll cover the key concepts and some advanced topics.
{% else %}
I'll focus on expert-level insights and edge cases.
{% endif %}
```

## Condition Types

### Equality Comparisons

```yapl
{% if status == "active" %}Active user{% endif %}
{% if count == 0 %}No items{% endif %}
{% if name == "admin" %}Administrator access{% endif %}
```

### Boolean Values

```yapl
{% if is_premium %}Premium features enabled{% endif %}
{% if not is_guest %}Welcome back!{% endif %}
{% if debug_mode %}Debug information will be shown{% endif %}
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

## Advanced Conditions

### Nested Conditionals

```yapl
{% if user_type == "premium" %}
  {% if feature_enabled %}
    Premium feature is available and enabled.
  {% else %}
    Premium feature is available but disabled.
  {% endif %}
{% else %}
  {% if trial_available %}
    Start your premium trial to access this feature.
  {% else %}
    Upgrade to premium to access this feature.
  {% endif %}
{% endif %}
```

### Multiple Conditions

While YAPL doesn't support `and`/`or` operators directly, you can achieve similar results with nested conditions:

```yapl
{% if user_type == "premium" %}
  {% if region == "US" %}
    US Premium features available.
  {% endif %}
{% endif %}

{# Equivalent to: if user_type == "premium" and region == "US" #}
```

For OR logic, use separate if statements:

```yapl
{% if user_type == "premium" %}
Special content for premium users.
{% endif %}
{% if user_type == "admin" %}
Special content for admin users.
{% endif %}
```

## Practical Examples

### User Experience Adaptation

```yapl
{% extends "base/agent.md.yapl" %}

{% block persona %}
{{ super() }}
{% if user_experience == "beginner" %}
You excel at breaking down complex topics into simple, digestible explanations.
You always check for understanding and provide plenty of examples.
{% elif user_experience == "intermediate" %}
You can assume basic knowledge but still provide clear explanations for advanced concepts.
{% else %}
You can use technical terminology and focus on nuanced, expert-level insights.
{% endif %}
{% endblock %}

{% block communication_style %}
{{ super() }}
{% if user_experience == "beginner" %}
- Use simple, non-technical language
- Define any technical terms you use
- Provide step-by-step instructions
- Ask if clarification is needed
{% else %}
- Use appropriate technical terminology
- Be concise and direct
- Focus on key insights
- Assume familiarity with basics
{% endif %}
{% endblock %}
```

### Feature Flags

```yapl
{% if features.advanced_mode %}
## Advanced Features
You have access to advanced capabilities including:
- Complex analysis
- Multi-step reasoning
- Advanced integrations
{% endif %}

{% if features.beta_features %}
## Beta Features
⚠️ Beta features are enabled. These may be unstable.
{% endif %}

{% if features.debug_mode %}
## Debug Information
Debug mode is active. Additional information will be provided.
{% endif %}
```

### Context-Aware Responses

```yapl
{% if context.session_type == "interview" %}
## Interview Mode
- Ask probing questions
- Evaluate responses critically
- Provide constructive feedback
- Focus on problem-solving approach
{% elif context.session_type == "tutoring" %}
## Tutoring Mode
- Be patient and encouraging
- Break down complex concepts
- Provide multiple examples
- Check for understanding frequently
{% elif context.session_type == "consultation" %}
## Consultation Mode
- Listen carefully to requirements
- Ask clarifying questions
- Provide expert recommendations
- Focus on practical solutions
{% endif %}
```

### Dynamic Content Inclusion

```yapl
{% if include_examples %}
## Examples

{% if domain == "programming" %}
Here's a code example:
```python
def hello_world():
    print("Hello, World!")
```
{% elif domain == "writing" %}
Here's a writing example:
"The quick brown fox jumps over the lazy dog."
{% else %}
Here's a general example relevant to your query.
{% endif %}
{% endif %}

{% if include_warnings %}
## Important Notes
{% if user_level == "beginner" %}
⚠️ Please be careful when following these instructions.
{% else %}
⚠️ Advanced users should consider edge cases.
{% endif %}
{% endif %}
```

### Multi-language Support

```yapl
{% if language == "spanish" %}
# Asistente de IA

Hola, soy tu asistente de inteligencia artificial.

{% if formal_tone %}
Le ayudaré con sus consultas de manera profesional.
{% else %}
Te ayudaré con tus preguntas de manera amigable.
{% endif %}

{% elif language == "french" %}
# Assistant IA

Bonjour, je suis votre assistant d'intelligence artificielle.

{% if formal_tone %}
Je vous aiderai avec vos questions de manière professionnelle.
{% else %}
Je t'aiderai avec tes questions de manière amicale.
{% endif %}

{% else %}
# AI Assistant

Hello, I am your artificial intelligence assistant.

{% if formal_tone %}
I will assist you with your inquiries in a professional manner.
{% else %}
I'll help you with your questions in a friendly way.
{% endif %}
{% endif %}
```

### Environment-Specific Configuration

```yapl
{% if environment == "development" %}
## Development Mode
- Detailed error messages enabled
- Debug information included
- Verbose logging active
- Test data may be used
{% elif environment == "staging" %}
## Staging Mode
- Limited error details
- Performance monitoring active
- Test scenarios available
{% else %}
## Production Mode
- Optimized for performance
- Error handling enabled
- Full security measures active
{% endif %}

{% if environment != "production" %}
⚠️ This is not a production environment.
{% endif %}
```

## Whitespace Control in Conditionals

Control whitespace around conditional blocks:

```yapl
{%- if show_section -%}
This content has no extra whitespace.
{%- endif -%}

{% if show_list %}
- Item 1
- Item 2
{%- endif %}
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

<!-- Avoid - complex nested logic -->
{% if user_type == "premium" %}
  {% if region == "US" %}
    {% if feature_enabled %}
      {% if not maintenance_mode %}
        Complex nested content
      {% endif %}
    {% endif %}
  {% endif %}
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

### 5. Use Consistent Patterns

```yapl
<!-- Establish patterns and stick to them -->
{% if user_level == "beginner" %}
  Beginner content
{% elif user_level == "intermediate" %}
  Intermediate content
{% else %}
  Advanced content
{% endif %}

<!-- Use the same pattern elsewhere -->
{% if complexity == "simple" %}
  Simple explanation
{% elif complexity == "moderate" %}
  Moderate explanation
{% else %}
  Complex explanation
{% endif %}
```

## Common Patterns

### Feature Toggles

```yapl
{% if features.new_ui %}
  New interface elements
{% else %}
  Legacy interface elements
{% endif %}
```

### A/B Testing

```yapl
{% if variant == "A" %}
  Version A content
{% else %}
  Version B content
{% endif %}
```

### Progressive Disclosure

```yapl
Basic information always shown.

{% if show_intermediate %}
Intermediate information for some users.

  {% if show_advanced %}
  Advanced information for expert users.
  {% endif %}
{% endif %}
```

### Error Handling

```yapl
{% if error_occurred %}
  {% if error_type == "validation" %}
    Please check your input and try again.
  {% elif error_type == "network" %}
    Network error. Please check your connection.
  {% else %}
    An unexpected error occurred. Please try again later.
  {% endif %}
{% else %}
  Normal content when no errors.
{% endif %}
```

Conditionals make your YAPL templates dynamic and responsive to different contexts, user types, and runtime conditions. They're essential for creating adaptive AI prompts that can handle various scenarios effectively.