---
title: Quick Start
description: Get up and running with YAPL in minutes
---

# Quick Start

This guide will get you up and running with YAPL in just a few minutes. We'll create a simple AI agent prompt that demonstrates the core features of YAPL.

## Step 1: Create Your First Template

Create a directory for your prompts and add a basic template:

```bash
mkdir my-prompts
cd my-prompts
```

Create `system.md.yapl`:

```yapl
# System Prompt

## Persona
You are {{ agent_name | default("a helpful AI assistant") }}.

## Guidelines
- Be helpful and accurate
- Provide clear explanations
- Ask clarifying questions when needed

{% if expertise %}
## Expertise
You specialize in {{ expertise }}.
{% endif %}

## Output Format
Respond in {{ format | default("markdown") }} format.
```

## Step 2: Render Your Template

Create a simple Node.js script to test your template:

```javascript
// test.js
import { NodeYAPL } from 'yapl';

const yapl = new NodeYAPL({ baseDir: './my-prompts' });

// Render with variables
const result = await yapl.render('system.md.yapl', {
  agent_name: 'CodeBot',
  expertise: 'software development',
  format: 'markdown'
});

console.log(result.content);
```

Run it:

```bash
node test.js
```

Output:
```markdown
# System Prompt

## Persona
You are CodeBot.

## Guidelines
- Be helpful and accurate
- Provide clear explanations
- Ask clarifying questions when needed

## Expertise
You specialize in software development.

## Output Format
Respond in markdown format.
```

## Step 3: Add Template Inheritance

Create a base template and extend it. First, create `base/agent.md.yapl`:

```yapl
# {{ title | default("AI Agent") }}

{% block persona %}
You are a helpful AI assistant.
{% endblock %}

{% block capabilities %}
## Capabilities
- Answer questions
- Provide explanations
- Help with tasks
{% endblock %}

{% block guidelines %}
## Guidelines
- Be accurate and helpful
- Ask for clarification when needed
- Provide step-by-step guidance
{% endblock %}

{% block output_format %}
## Output Format
Respond clearly and concisely.
{% endblock %}
```

Now create `coding-assistant.md.yapl` that extends the base:

```yapl
{% extends "base/agent.md.yapl" %}

{% block persona %}
You are {{ name | default("CodeBot") }}, an expert programming assistant.
You have deep knowledge of multiple programming languages and best practices.
{% endblock %}

{% block capabilities %}
{{ super() }}
- Write and review code
- Debug issues
- Explain programming concepts
- Suggest optimizations
{% endblock %}

{% block guidelines %}
{{ super() }}
- Always include code examples when relevant
- Explain your reasoning
- Consider security and performance implications
{% endblock %}
```

Test the inheritance:

```javascript
const result = await yapl.render('coding-assistant.md.yapl', {
  title: 'Programming Assistant',
  name: 'DevBot'
});
console.log(result.content);
```

## Step 4: Add Mixins for Composition

Create reusable mixins in a `mixins/` directory.

`mixins/friendly.md.yapl`:
```yapl
{% block persona %}
{{ super() }}
You have a friendly, encouraging personality and enjoy helping users learn.
{% endblock %}
```

`mixins/safety.md.yapl`:
```yapl
{% block guidelines %}
{{ super() }}
- Never provide harmful or dangerous information
- Decline inappropriate requests politely
- Prioritize user safety and well-being
{% endblock %}
```

Update your `coding-assistant.md.yapl` to use mixins:

```yapl
{% extends "base/agent.md.yapl" %}
{% mixin "mixins/friendly.md.yapl", "mixins/safety.md.yapl" %}

{% block persona %}
You are {{ name | default("CodeBot") }}, an expert programming assistant.
You have deep knowledge of multiple programming languages and best practices.
{% endblock %}

{% block capabilities %}
{{ super() }}
- Write and review code
- Debug issues
- Explain programming concepts
- Suggest optimizations
{% endblock %}
```

## Step 5: Add Conditional Logic

Make your template adaptive based on user context:

```yapl
{% extends "base/agent.md.yapl" %}
{% mixin "mixins/friendly.md.yapl", "mixins/safety.md.yapl" %}

{% block persona %}
You are {{ name | default("CodeBot") }}, an expert programming assistant.
{% if user_level == "beginner" %}
You excel at explaining complex concepts in simple terms and providing step-by-step guidance.
{% else %}
You can discuss advanced topics and assume familiarity with programming fundamentals.
{% endif %}
{% endblock %}

{% block guidelines %}
{{ super() }}
{% if user_level == "beginner" %}
- Use simple language and avoid jargon
- Provide detailed explanations
- Include plenty of examples
{% else %}
- You can use technical terminology
- Focus on efficiency and best practices
- Provide concise, expert-level advice
{% endif %}

{% if include_tests %}
- Always include unit tests with code examples
{% endif %}
{% endblock %}
```

Test with different contexts:

```javascript
// For a beginner
const beginnerResult = await yapl.render('coding-assistant.md.yapl', {
  name: 'TeachBot',
  user_level: 'beginner',
  include_tests: true
});

// For an expert
const expertResult = await yapl.render('coding-assistant.md.yapl', {
  name: 'ExpertBot',
  user_level: 'expert',
  include_tests: false
});
```

## Step 6: Use Includes for Modularity

Break large templates into smaller, reusable pieces:

`components/code-review-checklist.md.yapl`:
```yapl
## Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Functions are well-documented
- [ ] Error handling is appropriate
- [ ] Tests are included and passing
- [ ] Performance considerations addressed
```

Include it in your main template:

```yapl
{% extends "base/agent.md.yapl" %}

{% block guidelines %}
{{ super() }}

{% include "components/code-review-checklist.md.yapl" %}
{% endblock %}
```

## What's Next?

You've now seen the core features of YAPL in action:

- **Variables** with default values
- **Template inheritance** with `extends` and `block`
- **Mixins** for composition
- **Conditional logic** with `if/else`
- **Includes** for modularity

Ready to dive deeper? Explore the detailed documentation for each feature:

- [Variables](/features/variables/) - Learn about variable interpolation and filters
- [Template Inheritance](/features/inheritance/) - Master the extends/block system
- [Mixins](/features/mixins/) - Understand composition patterns
- [Conditionals](/features/conditionals/) - Explore conditional logic
- [Includes](/features/includes/) - Break templates into reusable components
- [Whitespace Control](/features/whitespace/) - Fine-tune output formatting

Or check out more [Examples](/examples/basic/) to see YAPL in real-world scenarios.