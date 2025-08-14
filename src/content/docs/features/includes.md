---
title: Includes
description: Learn how to use includes to break templates into reusable components
---

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

## Practical Examples

### Reusable Components

#### User Greeting Component
`components/user-greeting.md.yapl`:
```yapl
{% if user_name %}
Hello, {{ user_name }}!
{% else %}
Hello, guest!
{% endif %}

{% if user_role == "admin" %}
You have administrator privileges.
{% elif user_role == "premium" %}
You have premium access.
{% endif %}
```

Usage:
```yapl
{% include "components/user-greeting.md.yapl" with {"user_name": "Alice", "user_role": "admin"} %}
```

#### Code Review Checklist
`components/code-review-checklist.md.yapl`:
```yapl
## Code Review Checklist

### Functionality
- [ ] Code works as expected
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

### Quality
- [ ] Code is readable and well-documented
- [ ] Functions are appropriately sized
- [ ] Variable names are descriptive

### Standards
- [ ] Follows coding standards
- [ ] Includes appropriate tests
- [ ] Security considerations addressed

{% if language == "python" %}
### Python Specific
- [ ] Follows PEP 8 style guide
- [ ] Uses type hints where appropriate
- [ ] Includes docstrings for functions
{% elif language == "javascript" %}
### JavaScript Specific
- [ ] Uses consistent formatting
- [ ] Avoids global variables
- [ ] Includes JSDoc comments
{% endif %}
```

Usage:
```yapl
{% include "components/code-review-checklist.md.yapl" with {"language": "python"} %}
```

### Task Templates

#### Analysis Framework
`tasks/analysis-framework.md.yapl`:
```yapl
## Analysis Framework

### 1. Problem Definition
{% if problem_statement %}
**Problem:** {{ problem_statement }}
{% else %}
Clearly define the problem you're analyzing.
{% endif %}

### 2. Data Gathering
{% if data_sources %}
**Data Sources:**
{% for source in data_sources %}
- {{ source }}
{% endfor %}
{% else %}
Identify and gather relevant data sources.
{% endif %}

### 3. Analysis Method
{% if analysis_method %}
**Method:** {{ analysis_method }}
{% else %}
Choose appropriate analysis methods for your data.
{% endif %}

### 4. Key Questions
{% if key_questions %}
{% for question in key_questions %}
- {{ question }}
{% endfor %}
{% else %}
- What patterns emerge from the data?
- What are the key insights?
- What recommendations can be made?
{% endif %}
```

Usage:
```yapl
{% include "tasks/analysis-framework.md.yapl" with {
  "problem_statement": "Customer churn analysis",
  "data_sources": ["Customer database", "Usage logs", "Support tickets"],
  "analysis_method": "Cohort analysis and predictive modeling"
} %}
```

### Configuration Sections

#### Safety Guidelines
`config/safety-guidelines.md.yapl`:
```yapl
## Safety Guidelines

### Content Restrictions
- Do not provide harmful or dangerous information
- Decline requests for illegal activities
- Avoid generating inappropriate content

### Privacy Protection
- Do not store or remember personal information
- Respect user privacy and confidentiality
- Ask before sharing information with third parties

{% if strict_mode %}
### Strict Mode Active
- Additional content filtering enabled
- Conservative response approach
- Enhanced safety measures active
{% endif %}

### Escalation
{% if escalation_contact %}
For concerning requests, contact: {{ escalation_contact }}
{% else %}
Report concerning behavior through appropriate channels.
{% endif %}
```

#### Output Formatting
`config/output-format.md.yapl`:
```yapl
## Output Format

{% if format == "markdown" %}
Use markdown formatting with:
- **Bold** for emphasis
- *Italics* for subtle emphasis
- `Code blocks` for technical terms
- Lists for structured information
{% elif format == "json" %}
Respond in valid JSON format:
```json
{
  "response": "Your response here",
  "confidence": 0.95,
  "sources": ["source1", "source2"]
}
```
{% elif format == "structured" %}
Use clear headings and sections:
1. Summary
2. Details
3. Recommendations
4. Next Steps
{% else %}
Use clear, well-structured text with:
- Proper paragraphs
- Logical flow
- Clear conclusions
{% endif %}

{% if include_confidence %}
Always include confidence levels with your responses.
{% endif %}

{% if cite_sources %}
Cite sources when making factual claims.
{% endif %}
```

## Advanced Include Patterns

### Conditional Includes

```yapl
{% if include_safety_guidelines %}
{% include "config/safety-guidelines.md.yapl" %}
{% endif %}

{% if user_type == "developer" %}
{% include "components/technical-details.md.yapl" %}
{% endif %}

{% if environment == "production" %}
{% include "config/production-warnings.md.yapl" %}
{% endif %}
```

### Dynamic Includes

While you can't dynamically construct include paths, you can use conditionals to choose between includes:

```yapl
{% if template_type == "agent" %}
{% include "templates/agent-base.md.yapl" %}
{% elif template_type == "task" %}
{% include "templates/task-base.md.yapl" %}
{% else %}
{% include "templates/generic-base.md.yapl" %}
{% endif %}
```

### Nested Includes

Included templates can include other templates:

`components/full-agent.md.yapl`:
```yapl
{% include "components/agent-header.md.yapl" %}
{% include "components/agent-capabilities.md.yapl" %}
{% include "components/agent-guidelines.md.yapl" %}
{% include "components/agent-footer.md.yapl" %}
```

### Parameterized Components

Create flexible components that adapt based on parameters:

`components/feature-section.md.yapl`:
```yapl
## {{ section_title | default("Features") }}

{% if feature_list %}
{% for feature in feature_list %}
### {{ feature.name }}
{{ feature.description }}

{% if feature.example %}
**Example:** {{ feature.example }}
{% endif %}

{% if feature.limitations %}
**Limitations:** {{ feature.limitations }}
{% endif %}
{% endfor %}
{% else %}
No features specified.
{% endif %}

{% if show_contact %}
For more information about these features, contact {{ contact_info | default("support") }}.
{% endif %}
```

Usage:
```yapl
{% include "components/feature-section.md.yapl" with {
  "section_title": "Premium Features",
  "feature_list": [
    {
      "name": "Advanced Analytics",
      "description": "Deep insights into your data",
      "example": "Predictive modeling and trend analysis"
    },
    {
      "name": "Priority Support",
      "description": "24/7 dedicated support team",
      "limitations": "Available in business hours only"
    }
  ],
  "show_contact": true,
  "contact_info": "premium-support@company.com"
} %}
```

## Organization Strategies

### Component Library Structure

```
prompts/
├── components/
│   ├── headers/
│   │   ├── agent-header.md.yapl
│   │   ├── task-header.md.yapl
│   │   └── system-header.md.yapl
│   ├── sections/
│   │   ├── capabilities.md.yapl
│   │   ├── guidelines.md.yapl
│   │   └── examples.md.yapl
│   ├── footers/
│   │   ├── standard-footer.md.yapl
│   │   └── debug-footer.md.yapl
│   └── widgets/
│       ├── user-greeting.md.yapl
│       ├── feature-list.md.yapl
│       └── contact-info.md.yapl
├── config/
│   ├── safety.md.yapl
│   ├── privacy.md.yapl
│   └── formatting.md.yapl
└── tasks/
    ├── analysis.md.yapl
    ├── summarization.md.yapl
    └── translation.md.yapl
```

### Naming Conventions

```yapl
<!-- Good - descriptive names -->
{% include "components/user-authentication-check.md.yapl" %}
{% include "sections/premium-feature-list.md.yapl" %}
{% include "config/development-mode-warnings.md.yapl" %}

<!-- Avoid - generic names -->
{% include "component1.md.yapl" %}
{% include "stuff.md.yapl" %}
{% include "temp.md.yapl" %}
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

### 4. Handle Missing Parameters Gracefully

```yapl
<!-- Good - provides defaults and handles missing data -->
Hello, {{ user_name | default("guest") }}!

{% if user_role %}
Your role: {{ user_role }}
{% endif %}

{% if show_last_login and last_login %}
Last login: {{ last_login }}
{% endif %}
```

### 5. Avoid Deep Nesting

```yapl
<!-- Good - reasonable nesting -->
{% include "components/header.md.yapl" %}
  {% include "sections/main-content.md.yapl" %}
{% include "components/footer.md.yapl" %}

<!-- Avoid - too many levels -->
{% include "level1.md.yapl" %}
  {% include "level2.md.yapl" %}
    {% include "level3.md.yapl" %}
      {% include "level4.md.yapl" %}
```

Includes are essential for building maintainable, modular YAPL templates. They enable code reuse, improve organization, and make complex templates easier to understand and maintain.