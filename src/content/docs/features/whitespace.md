---
title: Whitespace Control
description: Learn how to control whitespace and formatting in YAPL templates
---

# Whitespace Control

YAPL provides several mechanisms to control whitespace in your templates, ensuring clean, properly formatted output. This is especially important for AI prompts where formatting can affect model performance.

## Global Whitespace Options

Configure whitespace behavior when creating a YAPL instance:

```javascript
const yapl = new NodeYAPL({
  baseDir: './prompts',
  whitespace: {
    trimBlocks: true,      // Remove newlines after block tags
    lstripBlocks: true,    // Remove leading whitespace before block tags  
    dedentBlocks: true     // Remove common indentation from block content
  }
});
```

### trimBlocks

Removes newlines immediately following block tags:

```yapl
<!-- Without trimBlocks -->
{% if condition %}
Content here
{% endif %}

More content

<!-- Output: -->
Content here

More content

<!-- With trimBlocks -->
{% if condition %}
Content here
{% endif %}
More content

<!-- Output: -->
Content here
More content
```

### lstripBlocks

Removes leading whitespace on lines that contain only block tags:

```yapl
<!-- Without lstripBlocks -->
    {% if condition %}
Content
    {% endif %}

<!-- Output: -->
    
Content
    

<!-- With lstripBlocks -->
    {% if condition %}
Content
    {% endif %}

<!-- Output: -->
Content
```

### dedentBlocks

Removes common indentation from block content:

```yapl
{% block content %}
    This is indented content.
    
    This line has the same indentation.
    
        This line has extra indentation.
{% endblock %}

<!-- With dedentBlocks, output: -->
This is indented content.

This line has the same indentation.

    This line has extra indentation.
```

## Manual Whitespace Control

### Tag-level Control

Use `-` modifiers to control whitespace around individual tags:

```yapl
{%- if condition -%}     <!-- Remove whitespace on both sides -->
{% if condition -%}      <!-- Remove whitespace on the right -->
{%- if condition %}      <!-- Remove whitespace on the left -->
```

### Variable Whitespace Control

```yapl
{{- variable -}}         <!-- Remove whitespace on both sides -->
{{ variable -}}          <!-- Remove whitespace on the right -->
{{- variable }}          <!-- Remove whitespace on the left -->
```

### Examples

#### Tight Formatting
```yapl
Hello,{{- " " -}}{{ name -}}!
```

With `name = "World"`:
```
Hello, World!
```

#### List Formatting
```yapl
Skills:
{%- for skill in skills %}
- {{ skill }}
{%- endfor %}
```

With `skills = ["Python", "JavaScript"]`:
```
Skills:
- Python
- JavaScript
```

## Practical Examples

### Clean Agent Prompts

```yapl
# {{ agent_name | default("AI Assistant") }}

{%- if persona %}
## Persona
{{ persona }}
{%- endif %}

{%- if capabilities %}
## Capabilities
{%- for capability in capabilities %}
- {{ capability }}
{%- endfor %}
{%- endif %}

{%- if guidelines %}
## Guidelines
{%- for guideline in guidelines %}
- {{ guideline }}
{%- endfor %}
{%- endif %}
```

This produces clean output without extra blank lines when sections are omitted.

### Conditional Content

```yapl
You are a {{ role | default("helpful assistant") }}.
{%- if expertise %} You specialize in {{ expertise }}.{%- endif %}
{%- if personality %} You have a {{ personality }} personality.{%- endif %}

{%- if user_context %}

## User Context
{%- if user_context.experience_level %}
User experience level: {{ user_context.experience_level }}
{%- endif %}
{%- if user_context.preferences %}
User preferences: {{ user_context.preferences }}
{%- endif %}
{%- endif %}
```

### Code Block Formatting

```yapl
{%- if include_example %}
Here's an example:

```{{ language | default("text") }}
{%- if code_example %}
{{ code_example }}
{%- else %}
// Example code would go here
{%- endif %}
```
{%- endif %}
```

### Inline Conditionals

```yapl
Hello{% if title %}, {{ title }}{% endif %} {{ name }}{% if excited %}!{% else %}.{% endif %}
```

With variables:
- `title = "Dr."`, `name = "Smith"`, `excited = true` → "Hello, Dr. Smith!"
- `name = "Alice"`, `excited = false` → "Hello Alice."

## Advanced Whitespace Patterns

### Comma-separated Lists

```yapl
Your skills include: 
{%- for skill in skills -%}
{{ skill }}
{%- if skill != skills.last %}, {% endif -%}
{%- endfor %}.
```

**Note:** YAPL doesn't have built-in loop variables like `loop.first` or `loop.last`. For comma-separated lists, consider using JavaScript to pre-format the data or handle formatting in your application logic.

### Paragraph Joining

```yapl
{%- for paragraph in content -%}
{{ paragraph }}

{%- endfor %}
```

### Nested Block Formatting

```yapl
{% block main_content -%}
    {%- block introduction -%}
        Welcome to {{ service_name | default("our service") }}.
    {%- endblock %}
    
    {%- if features -%}
        {%- block features -%}
            ## Features
            {%- for feature in features %}
            - {{ feature }}
            {%- endfor %}
        {%- endblock %}
    {%- endif %}
    
    {%- block conclusion -%}
        Thank you for using {{ service_name | default("our service") }}.
    {%- endblock -%}
{%- endblock %}
```

## Template-specific Whitespace Control

**Note:** YAPL doesn't support per-render whitespace overrides. Whitespace settings are configured at the instance level. To use different whitespace settings, create separate YAPL instances:

```javascript
// Instance for tight formatting
const tightYapl = new NodeYAPL({
  baseDir: './prompts',
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true
  }
});

// Instance for loose formatting  
const looseYapl = new NodeYAPL({
  baseDir: './prompts',
  whitespace: {
    trimBlocks: false,
    lstripBlocks: false,
    dedentBlocks: false
  }
});
```

## Common Patterns

### Clean Section Headers

```yapl
{%- if section_title %}
## {{ section_title }}
{%- endif %}

{%- if section_content %}
{{ section_content }}
{%- endif %}

{%- if subsections %}
{%- for subsection in subsections %}
### {{ subsection.title }}
{{ subsection.content }}
{%- endfor %}
{%- endif %}
```

### Compact Lists

```yapl
{%- if items %}
Items: 
{%- for item in items -%}
{{ item }}{% if item != items.last %}, {% endif %}
{%- endfor %}
{%- endif %}
```

**Note:** For complex list formatting, consider pre-processing your data in JavaScript before passing to YAPL.

### Conditional Punctuation

```yapl
Hello{% if name %} {{ name }}{% endif %}{% if enthusiastic %}!{% else %}.{% endif %}
```

### Multi-line String Cleanup

**Note:** YAPL doesn't support `set` variables or string filters like `replace`. For complex string manipulation, pre-process your data in JavaScript:

```javascript
const processedText = longText
  .replace(/\n/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const result = await yapl.renderString(template, { 
  processed_text: processedText 
});
```

## Best Practices

### 1. Be Consistent

Choose a whitespace strategy and apply it consistently throughout your templates:

```yapl
<!-- Good - consistent style -->
{%- if condition1 -%}
Content 1
{%- endif -%}

{%- if condition2 -%}
Content 2
{%- endif -%}

<!-- Avoid - inconsistent style -->
{%- if condition1 -%}
Content 1
{%- endif -%}

{% if condition2 %}
Content 2
{% endif %}
```

### 2. Use Global Settings

Set global whitespace options rather than manually controlling every tag:

```javascript
// Good - set global defaults
const yapl = new NodeYAPL({
  baseDir: './prompts',
  whitespace: {
    trimBlocks: true,
    lstripBlocks: true,
    dedentBlocks: true
  }
});

// Then only use manual control for exceptions
```

### 3. Test Output Formatting

Always verify that your whitespace control produces the expected output:

```javascript
const result = await yapl.renderString(template, variables);
console.log(JSON.stringify(result.content)); // Shows exact whitespace
```

### 4. Consider AI Model Requirements

Some AI models are sensitive to formatting. Test your prompts to ensure whitespace doesn't affect performance:

```yapl
<!-- Good for most models - clean, structured -->
# System Prompt

You are an AI assistant.

## Guidelines
- Be helpful
- Be accurate

<!-- May cause issues - inconsistent spacing -->
#System Prompt


You are an AI assistant.


##Guidelines
-Be helpful
-Be accurate
```

### 5. Document Whitespace Decisions

```yapl
{#
This template uses tight whitespace control to ensure
clean output without extra blank lines.
#}

{%- if title -%}
# {{ title }}
{%- endif -%}
```

## Debugging Whitespace Issues

### Visualize Whitespace

```javascript
// Add markers to see whitespace
const debug = result.content
  .replace(/ /g, '·')
  .replace(/\n/g, '↵\n')
  .replace(/\t/g, '→');
console.log(debug);
```

### Common Issues and Solutions

#### Extra Blank Lines

```yapl
<!-- Problem -->
{% if condition %}
Content
{% endif %}

More content

<!-- Solution -->
{%- if condition %}
Content
{%- endif %}
More content
```

#### Missing Spaces

```yapl
<!-- Problem -->
Hello{{name}}!

<!-- Solution -->
Hello {{ name }}!
<!-- or -->
Hello{{- " " -}}{{ name }}!
```

#### Inconsistent Indentation

```yapl
<!-- Problem -->
{% block content %}
    Line 1
        Line 2
    Line 3
{% endblock %}

<!-- Solution - use dedentBlocks: true -->
{% block content %}
    Line 1
        Line 2
    Line 3
{% endblock %}
```

## Performance Considerations

Whitespace control has minimal performance impact, but consider:

1. **Global settings** are more efficient than per-tag control
2. **dedentBlocks** requires text processing, so disable if not needed
3. **Complex whitespace logic** can make templates harder to read

## Integration with Other Features

### With Inheritance

```yapl
<!-- Parent template -->
{% block content -%}
Default content
{%- endblock %}

<!-- Child template -->
{%- block content -%}
{{ super() }}
Additional content
{%- endblock -%}
```

### With Mixins

```yapl
<!-- Mixin -->
{%- block guidelines -%}
{{ super() }}
- Additional guideline
{%- endblock -%}
```

### With Includes

```yapl
{%- include "components/header.md.yapl" -%}

Main content here

{%- include "components/footer.md.yapl" -%}
```

Proper whitespace control ensures your YAPL templates produce clean, well-formatted output that's optimized for AI models and human readability.