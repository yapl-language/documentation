---
title: For Loops
description: Iterate over arrays and collections in YAPL templates
---

# For Loops

YAPL supports for loops to iterate over arrays and collections, allowing you to generate repeated content dynamically.

## Basic Syntax

```yapl
{% for item in items %}
  {{ item }}
{% endfor %}
```

## Simple Array Iteration

Iterate over a simple array of values:

```yapl
{% for fruit in fruits %}
  - {{ fruit }}
{% endfor %}
```

With variables:

```javascript
{
  fruits: ["apple", "banana", "cherry"];
}
```

Output:

```
- apple
- banana
- cherry
```

## Object Array Iteration

Iterate over arrays of objects to access their properties:

```yapl
{% for technique in study_techniques %}
  - **{{ technique.name }}**: {{ technique.description }}
{% endfor %}
```

With variables:

```javascript
{
  study_techniques: [
    { name: "Pomodoro", description: "25-minute focused work sessions" },
    {
      name: "Spaced Repetition",
      description: "Review material at increasing intervals",
    },
    {
      name: "Active Recall",
      description: "Test yourself instead of re-reading",
    },
  ];
}
```

Output:

```
- **Pomodoro**: 25-minute focused work sessions
- **Spaced Repetition**: Review material at increasing intervals
- **Active Recall**: Test yourself instead of re-reading
```

## Array Literals

You can iterate over array literals directly in the template:

```yapl
{% for num in [1, 2, 3, 4, 5] %}
  {{ num }}{% if num < 5 %}, {% endif %}
{% endfor %}
```

Output:

```
1, 2, 3, 4, 5
```

## Nested For Loops

For loops can be nested to iterate over multi-dimensional data:

```yapl
{% for category in categories %}
  ## {{ category.name }}
  {% for item in category.items %}
    - {{ item }}
  {% endfor %}
{% endfor %}
```

With variables:

```javascript
{
  categories: [
    { name: "Fruits", items: ["apple", "banana"] },
    { name: "Vegetables", items: ["carrot", "broccoli"] },
  ];
}
```

Output:

```
## Fruits
- apple
- banana
## Vegetables
- carrot
- broccoli
```

## Whitespace Control

Like other YAPL constructs, for loops support whitespace control using the `-` modifier:

```yapl
{%- for item in items -%}
  {{ item }}
{%- endfor -%}
```

This removes whitespace around the for loop tags. See the [Whitespace Control](/features/whitespace) documentation for more details.

## Error Handling

YAPL will throw an error if you try to iterate over a non-array value:

```yapl
{% for item in notAnArray %}
  {{ item }}
{% endfor %}
```

If `notAnArray` is a string or other non-array value, you'll get an error:

```
For loop iterable must be an array, got: string
```

## Empty Arrays

If the array is empty or undefined, the for loop content is simply skipped:

```yapl
{% for item in emptyArray %}
  This won't be rendered
{% endfor %}
```

## Best Practices

### 1. Use descriptive variable names

Choose meaningful names for your iterator variables

```yapl
{% for technique in study_techniques %}  <!-- Good -->
{% for t in study_techniques %}          <!-- Less clear -->
```

### 2. Handle empty arrays gracefully

Consider adding conditional checks for empty arrays

```yapl
{% if techniques %}
  {% for technique in techniques %}
    - {{ technique.name }}
  {% endfor %}
{% else %}
  No techniques available.
{% endif %}
```
