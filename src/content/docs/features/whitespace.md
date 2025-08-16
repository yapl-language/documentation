# Whitespace Control

YAPL provides mechanisms to control whitespace in your templates, ensuring clean, properly formatted output. This is especially important for AI prompts where formatting can affect model performance.

## Global Whitespace Options

Configure whitespace behavior when creating a YAPL instance:

```javascript
const yapl = new NodeYAPL({
  baseDir: "./prompts",
  whitespace: {
    trimBlocks: true, // Remove newlines after block tags (default: true)
    lstripBlocks: true, // Remove leading whitespace before block tags (default: true)
    dedentBlocks: true, // Remove common indentation from block content (default: true)
  },
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

<!-- With trimBlocks (default) -->
{% if condition %}
Content here
{% endif %}
More content
```

### lstripBlocks

Removes leading whitespace on lines that contain only block tags:

```yapl
<!-- Template with indented tags -->
    {% if condition %}
Content
    {% endif %}

<!-- With lstripBlocks (default), leading spaces before tags are removed -->
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

<!-- With dedentBlocks (default), output: -->
This is indented content.
This line has the same indentation.
    This line has extra indentation.
```

## Manual Whitespace Control

Use `-` modifiers to control whitespace around individual tags:

### Control Tags

```yapl
{%- if condition -%}     <!-- Remove whitespace on both sides -->
{% if condition -%}      <!-- Remove whitespace on the right -->
{%- if condition %}      <!-- Remove whitespace on the left -->
```

### Variable Tags

```yapl
{{- variable -}}         <!-- Remove whitespace on both sides -->
{{ variable -}}          <!-- Remove whitespace on the right -->
{{- variable }}          <!-- Remove whitespace on the left -->
```

### Comment Tags

```yapl
{#- This comment strips surrounding whitespace -#}
```

Proper whitespace control ensures your YAPL templates produce clean, well-formatted output optimized for AI models and human readability.
