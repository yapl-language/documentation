# YAPL Syntax Highlighting in Starlight

This document explains how YAPL syntax highlighting is implemented in the Starlight documentation.

## Implementation Overview

The YAPL syntax highlighting follows the official Starlight approach for custom languages using Expressive Code and Shiki. It leverages the existing TextMate grammars from the YAPL VS Code extension.

## Architecture

### 1. Grammar Loading (`src/utils/yapl-grammars.mjs`)

The `loadYaplGrammars()` function:
- Loads TextMate grammar files from `yapl-vscode/syntaxes/`
- Creates a unified `source.yapl` grammar for code blocks
- Handles errors gracefully if grammar files are missing
- Provides console feedback for debugging

### 2. Astro Configuration (`astro.config.mjs`)

The configuration:
- Imports the grammar loader utility
- Configures Expressive Code with YAPL grammars
- Sets up custom styling and themes
- Uses JetBrains Mono font for consistency with YAPL website

### 3. Custom Styling (`src/styles/custom.css`)

YAPL-specific CSS provides:
- Pink-themed syntax highlighting matching YAPL brand
- Special borders and shadows for YAPL code blocks
- Custom token colors for directives, variables, keywords
- Enhanced copy buttons and headers
- YAPL logo indicator in code block headers

## Supported Syntax

The implementation highlights:

### Comments
```yapl
{# This is a YAPL comment #}
```

### Variables
```yapl
{{ variable_name }}
{{ nested.property }}
{{ variable | default("fallback") }}
```

### Directives
```yapl
{% extends "template.yapl" %}
{% block name %}...{% endblock %}
{% include "file.yapl" %}
{% mixin "mixin.yapl" %}
{% if condition %}...{% endif %}
```

### Keywords
- `extends`, `block`, `endblock`
- `include`, `with`, `mixin`
- `if`, `else`, `endif`
- `super()`

## Usage in Documentation

### Basic Code Block
````markdown
```yapl
{% extends "base.yapl" %}
{% block content %}
Hello, {{ name }}!
{% endblock %}
```
````

### With Title
````markdown
```yapl title="example.yapl"
{# Example YAPL template #}
{{ greeting | default("Hello") }}, {{ name }}!
```
````

### With Line Highlighting
````markdown
```yapl {2-4}
{% extends "base.yapl" %}
{% block content %}
Hello, {{ name }}!
{% endblock %}
```
````

## File Structure

```
documentation/
├── src/
│   ├── utils/
│   │   └── yapl-grammars.mjs     # Grammar loader
│   └── styles/
│       └── custom.css            # YAPL syntax styling
├── astro.config.mjs              # Starlight configuration
└── YAPL_SYNTAX_HIGHLIGHTING.md  # This documentation
```

## Dependencies

- **TextMate Grammars**: Located in `yapl-vscode/syntaxes/`
- **Expressive Code**: Starlight's code block renderer
- **Shiki**: Syntax highlighting engine
- **JetBrains Mono**: Font for code blocks

## Troubleshooting

### Grammar Not Loading
If YAPL syntax highlighting isn't working:

1. Check console for error messages
2. Verify `yapl-vscode/syntaxes/` directory exists
3. Ensure grammar files are valid JSON
4. Check file paths in `yapl-grammars.mjs`

### Styling Issues
If colors or styling look wrong:

1. Check CSS custom properties in `custom.css`
2. Verify theme variables are defined
3. Test in both light and dark modes
4. Check browser developer tools for CSS conflicts

### Performance
The grammar loading happens at build time, so there's no runtime performance impact. The grammars are cached by Shiki for efficient highlighting.

## Extending

To add more YAPL syntax features:

1. Update TextMate grammars in `yapl-vscode/syntaxes/`
2. Add corresponding CSS token styles
3. Test with various YAPL code examples
4. Update this documentation

## Best Practices

1. **Use descriptive titles** for YAPL code blocks
2. **Highlight important lines** with `{line-numbers}`
3. **Include comments** in examples for clarity
4. **Test in both themes** (light/dark)
5. **Keep examples realistic** and practical

## Integration with YAPL Website

The syntax highlighting maintains visual consistency with:
- YAPL website color scheme (pink gradients)
- JetBrains Mono font family
- Similar code block styling
- Brand-consistent visual elements

This creates a seamless experience between the main YAPL website and documentation.