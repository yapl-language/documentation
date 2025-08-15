---
title: Basic Examples
description: Simple examples to get started with YAPL
---

# Basic Examples

This page contains simple, practical examples to help you understand YAPL's core features. Each example builds on the previous ones, introducing new concepts gradually.

## Example 1: Simple Variable Substitution

The most basic YAPL template uses variables to make content dynamic.

**Template** (`greeting.md.yapl`):
```yapl
Hello, {{ name | default("World") }}!

{% if message %}
{{ message }}
{% else %}
Welcome to YAPL!
{% endif %}
```

**Usage**:
```javascript
import { NodeYAPL } from '@yapl-language/yapl.ts';

const yapl = new NodeYAPL({ baseDir: './prompts' });

// With variables
const result1 = await yapl.render('greeting.md.yapl', {
  name: 'Alice',
  message: 'Great to see you!'
});

// Without variables (uses defaults)
const result2 = await yapl.render('greeting.md.yapl', {});
```

**Output 1**:
```
Hello, Alice!

Great to see you!
```

**Output 2**:
```
Hello, World!

Welcome to YAPL!
```

## Example 2: Basic AI Agent Template

Create a simple AI agent prompt that adapts based on the domain.

**Template** (`simple-agent.md.yapl`):
```yapl
# {{ agent_name | default("AI Assistant") }}

You are {{ agent_name | default("an AI assistant") }} specializing in {{ domain | default("general assistance") }}.

## Your Role
{% if domain == "programming" %}
You help users with coding questions, debug issues, and explain programming concepts.
{% elif domain == "writing" %}
You assist with writing tasks, grammar, style, and content creation.
{% elif domain == "math" %}
You solve mathematical problems and explain mathematical concepts clearly.
{% else %}
You provide helpful information and assistance across various topics.
{% endif %}

## Guidelines
- Be helpful and accurate
- Ask clarifying questions when needed
{% if expertise_level == "beginner" %}
- Use simple language and provide detailed explanations
- Include examples to illustrate concepts
{% else %}
- You can use technical terminology appropriately
- Focus on efficient, expert-level guidance
{% endif %}

## Output Format
Respond in {{ format | default("clear, well-structured text") }}.
```

**Usage**:
```javascript
// Programming assistant for beginners
const codingBot = await yapl.render('simple-agent.md.yapl', {
  agent_name: 'CodeHelper',
  domain: 'programming',
  expertise_level: 'beginner',
  format: 'markdown with code examples'
});

// Writing assistant for experts
const writingBot = await yapl.render('simple-agent.md.yapl', {
  agent_name: 'WriteBot',
  domain: 'writing',
  expertise_level: 'expert'
});
```

## Example 3: Template with Conditional Sections

Build a template that includes different sections based on context.

**Template** (`contextual-assistant.md.yapl`):
```yapl
# Context-Aware Assistant

You are an AI assistant that adapts to different situations.

{% if context == "customer_support" %}
## Customer Support Mode
- Be patient and empathetic
- Listen carefully to customer concerns
- Provide step-by-step solutions
- Escalate complex issues when necessary

{% elif context == "tutoring" %}
## Tutoring Mode
- Be encouraging and supportive
- Break down complex concepts
- Check for understanding frequently
- Provide practice opportunities

{% elif context == "brainstorming" %}
## Brainstorming Mode
- Encourage creative thinking
- Build on user ideas
- Suggest alternative approaches
- Avoid being overly critical

{% else %}
## General Mode
- Be helpful and informative
- Adapt your communication style to the user
- Ask clarifying questions when needed
{% endif %}

{% if include_examples %}
## Examples
{% if context == "customer_support" %}
- "I understand your frustration. Let me help you resolve this issue."
- "Can you provide more details about when this problem started?"
{% elif context == "tutoring" %}
- "Great question! Let's work through this step by step."
- "Does this explanation make sense so far?"
{% elif context == "brainstorming" %}
- "That's an interesting idea! What if we also considered..."
- "Here are a few different approaches we could explore..."
{% endif %}
{% endif %}

{% if constraints %}
## Constraints
{% for constraint in constraints %}
- {{ constraint }}
{% endfor %}
{% endif %}
```

**Usage**:
```javascript
// Customer support assistant
const supportBot = await yapl.render('contextual-assistant.md.yapl', {
  context: 'customer_support',
  include_examples: true,
  constraints: [
    'Follow company policies',
    'Escalate billing issues to finance team',
    'Document all interactions'
  ]
});

// Tutoring assistant
const tutorBot = await yapl.render('contextual-assistant.md.yapl', {
  context: 'tutoring',
  include_examples: true
});
```

## Example 4: Multi-language Support

Create a template that works in multiple languages.

**Template** (`multilingual-greeter.md.yapl`):
```yapl
{% if language == "spanish" %}
# Asistente de IA

¡Hola! Soy tu asistente de inteligencia artificial.

## Mi función
Estoy aquí para ayudarte con {{ task | default("tus preguntas") }}.

{% if formal %}
Le ayudaré de manera profesional y cortés.
{% else %}
Te ayudaré de manera amigable y relajada.
{% endif %}

{% elif language == "french" %}
# Assistant IA

Bonjour ! Je suis votre assistant d'intelligence artificielle.

## Ma fonction
Je suis là pour vous aider avec {{ task | default("vos questions") }}.

{% if formal %}
Je vous aiderai de manière professionnelle et courtoise.
{% else %}
Je vous aiderai de manière amicale et détendue.
{% endif %}

{% else %}
# AI Assistant

Hello! I am your artificial intelligence assistant.

## My Role
I'm here to help you with {{ task | default("your questions") }}.

{% if formal %}
I will assist you in a professional and courteous manner.
{% else %}
I'll help you in a friendly and relaxed way.
{% endif %}
{% endif %}

{% if capabilities %}
## Capabilities
{% for capability in capabilities %}
- {{ capability }}
{% endfor %}
{% endif %}
```

**Usage**:
```javascript
// Spanish formal assistant
const spanishBot = await yapl.render('multilingual-greeter.md.yapl', {
  language: 'spanish',
  formal: true,
  task: 'programación',
  capabilities: ['Escribir código', 'Depurar errores', 'Explicar conceptos']
});

// English casual assistant
const englishBot = await yapl.render('multilingual-greeter.md.yapl', {
  language: 'english',
  formal: false,
  task: 'creative writing',
  capabilities: ['Generate ideas', 'Edit text', 'Provide feedback']
});
```

## Example 5: Dynamic Task Template

Create a flexible template for different types of tasks.

**Template** (`task-template.md.yapl`):
```yapl
# Task: {{ task_name | default("General Task") }}

{% if task_description %}
## Description
{{ task_description }}
{% endif %}

## Instructions
{% if task_type == "analysis" %}
1. Examine the provided data carefully
2. Identify key patterns and trends
3. Draw meaningful conclusions
4. Provide actionable recommendations

{% elif task_type == "creative" %}
1. Brainstorm creative ideas
2. Develop the most promising concepts
3. Create original content
4. Refine and polish the output

{% elif task_type == "problem_solving" %}
1. Clearly define the problem
2. Identify possible solutions
3. Evaluate pros and cons of each option
4. Recommend the best approach

{% else %}
1. Understand the requirements
2. Plan your approach
3. Execute the task systematically
4. Review and refine your work
{% endif %}

{% if input_data %}
## Input Data
{{ input_data }}
{% endif %}

{% if constraints %}
## Constraints
{% for constraint in constraints %}
- {{ constraint }}
{% endfor %}
{% endif %}

{% if output_format %}
## Expected Output Format
{{ output_format }}
{% else %}
## Expected Output Format
Provide a clear, well-structured response that addresses all requirements.
{% endif %}

{% if examples and task_type %}
## Example
{% if task_type == "analysis" %}
"Based on the data analysis, I found three key trends: [trend 1], [trend 2], and [trend 3]. I recommend [specific action] to address these findings."

{% elif task_type == "creative" %}
"Here's a creative concept: [concept description]. This approach is unique because [reasoning] and would appeal to the target audience by [benefits]."

{% elif task_type == "problem_solving" %}
"The core problem is [problem statement]. After evaluating several options, I recommend [solution] because [reasoning]. Implementation steps: [steps]."
{% endif %}
{% endif %}
```

**Usage**:
```javascript
// Analysis task
const analysisTask = await yapl.render('task-template.md.yapl', {
  task_name: 'Sales Data Analysis',
  task_type: 'analysis',
  task_description: 'Analyze quarterly sales data to identify trends and opportunities',
  input_data: 'Q1-Q4 sales figures, customer demographics, product performance metrics',
  constraints: [
    'Focus on actionable insights',
    'Include confidence levels for predictions',
    'Highlight any data quality issues'
  ],
  output_format: 'Executive summary with charts and detailed appendix',
  examples: true
});

// Creative task
const creativeTask = await yapl.render('task-template.md.yapl', {
  task_name: 'Marketing Campaign Ideas',
  task_type: 'creative',
  task_description: 'Generate innovative marketing campaign concepts for a new product launch',
  constraints: [
    'Budget under $50K',
    'Target audience: millennials',
    'Must include social media component'
  ],
  examples: true
});
```

## Key Takeaways

These basic examples demonstrate:

1. **Variable substitution** with defaults for flexibility
2. **Conditional logic** to adapt content based on context
3. **Multi-language support** using conditionals
4. **Dynamic content generation** based on parameters
5. **Structured templates** that maintain consistency while allowing customization

## Next Steps

Ready for more advanced examples? Check out:

- [AI Agent Templates](/examples/agents/) - Complex agent personalities and behaviors
- [Complex Workflows](/examples/workflows/) - Multi-step processes and advanced patterns

Or dive deeper into specific features:

- [Template Inheritance](/features/inheritance/) - Building template hierarchies
- [Mixins](/features/mixins/) - Composing templates from reusable components
- [Advanced Conditionals](/features/conditionals/) - Complex conditional logic