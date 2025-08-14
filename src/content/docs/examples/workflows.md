---
title: Complex Workflows
description: Advanced examples showing complex multi-step workflows and patterns
---

# Complex Workflows

This page demonstrates advanced YAPL patterns for building complex, multi-step workflows and sophisticated prompt systems.

## Example 1: Multi-Stage Code Review Workflow

This example shows how to create a comprehensive code review system with multiple stages and different reviewer types.

### Base Review Template

**File:** `workflows/code-review/base-review.md.yapl`
```yapl
# Code Review: {{ pull_request.title | default("Untitled PR") }}

## Review Context
- **Author:** {{ pull_request.author }}
- **Branch:** {{ pull_request.branch }}
- **Files Changed:** {{ pull_request.files_changed | default(0) }}
- **Lines Added:** {{ pull_request.lines_added | default(0) }}
- **Lines Removed:** {{ pull_request.lines_removed | default(0) }}

{% block review_focus %}
## Review Focus
{% if review_stage == "initial" %}
Focus on overall architecture, design patterns, and major issues.
{% elif review_stage == "detailed" %}
Focus on code quality, edge cases, and implementation details.
{% elif review_stage == "security" %}
Focus on security vulnerabilities and potential attack vectors.
{% elif review_stage == "performance" %}
Focus on performance implications and optimization opportunities.
{% else %}
Comprehensive review covering all aspects.
{% endif %}
{% endblock %}

{% block reviewer_guidelines %}
## Reviewer Guidelines
- Be constructive and specific in feedback
- Explain the reasoning behind suggestions
- Consider the context and constraints
- Balance thoroughness with practicality

{% if review_urgency == "high" %}
⚠️ **High Priority Review** - Focus on critical issues only
{% elif review_urgency == "low" %}
📝 **Thorough Review** - Take time for detailed analysis
{% endif %}
{% endblock %}

{% block code_context %}
{% if code_diff %}
## Code Changes
```diff
{{ code_diff }}
```
{% endif %}

{% if related_issues %}
## Related Issues
{% for issue in related_issues %}
- [#{{ issue.number }}]({{ issue.url }}): {{ issue.title }}
{% endfor %}
{% endif %}
{% endblock %}

{% block review_checklist %}
## Review Checklist
{% include "../components/review-checklist.md.yapl" with {
  "language": language,
  "review_type": review_stage,
  "security_critical": security_critical
} %}
{% endblock %}

{% block specific_instructions %}
{# Override in specific review templates #}
{% endblock %}
```

### Specialized Review Templates

**File:** `workflows/code-review/security-review.md.yapl`
```yapl
{% extends "base-review.md.yapl" %}

{% block specific_instructions %}
## Security Review Instructions

### Primary Security Concerns
{% if language == "javascript" %}
- Check for XSS vulnerabilities in DOM manipulation
- Verify input sanitization and validation
- Review authentication and authorization logic
- Check for prototype pollution risks
- Validate dependency security
{% elif language == "python" %}
- Check for SQL injection vulnerabilities
- Verify input validation and sanitization
- Review authentication and session management
- Check for code injection risks
- Validate serialization/deserialization security
{% elif language == "java" %}
- Check for injection vulnerabilities
- Review authentication and authorization
- Verify input validation
- Check for deserialization vulnerabilities
- Review cryptographic implementations
{% endif %}

### Security Checklist
- [ ] All user inputs are properly validated
- [ ] Authentication mechanisms are secure
- [ ] Authorization checks are in place
- [ ] Sensitive data is properly protected
- [ ] Error messages don't leak information
- [ ] Dependencies are up to date and secure
- [ ] Cryptographic operations use secure algorithms

### Risk Assessment
{% if security_critical %}
🔴 **Critical System** - Any security issue is a blocker
- Require security team approval
- Perform additional penetration testing
- Document all security decisions
{% else %}
🟡 **Standard Review** - Follow normal security practices
- Address high and medium severity issues
- Document security considerations
{% endif %}

### Escalation
Escalate to security team if:
- Potential data breach risks identified
- Cryptographic implementations are modified
- Authentication/authorization logic changes
- Third-party integrations with sensitive data
{% endblock %}
```

**File:** `workflows/code-review/performance-review.md.yapl`
```yapl
{% extends "base-review.md.yapl" %}

{% block specific_instructions %}
## Performance Review Instructions

### Performance Focus Areas
{% if application_type == "web" %}
- Database query optimization
- Caching strategies
- Bundle size and loading performance
- Memory usage patterns
- API response times
{% elif application_type == "mobile" %}
- Battery usage optimization
- Memory management
- Network efficiency
- UI responsiveness
- Background processing
{% elif application_type == "backend" %}
- Scalability considerations
- Database performance
- Caching strategies
- Resource utilization
- Concurrent processing
{% endif %}

### Performance Metrics
{% if performance_requirements %}
**Target Metrics:**
{% for metric in performance_requirements %}
- {{ metric.name }}: {{ metric.target }}
{% endfor %}
{% endif %}

### Analysis Framework
1. **Identify Bottlenecks**
   - Profile critical code paths
   - Measure resource usage
   - Identify slow operations

2. **Evaluate Solutions**
   - Consider algorithmic improvements
   - Evaluate caching opportunities
   - Assess trade-offs

3. **Validate Changes**
   - Benchmark before/after
   - Test under load
   - Monitor production impact

### Performance Checklist
- [ ] No obvious performance anti-patterns
- [ ] Database queries are optimized
- [ ] Appropriate caching is implemented
- [ ] Memory usage is reasonable
- [ ] No blocking operations in critical paths
- [ ] Algorithms have appropriate complexity
- [ ] Resource cleanup is handled properly

{% if load_testing_required %}
### Load Testing Requirements
- Test with {{ concurrent_users | default(100) }} concurrent users
- Validate response times under load
- Check memory usage patterns
- Monitor error rates
{% endif %}
{% endblock %}
```

### Review Orchestration

**File:** `workflows/code-review/review-orchestrator.md.yapl`
```yapl
# Code Review Workflow Orchestration

## Review Stages
{% for stage in review_stages %}
### Stage {{ loop.index }}: {{ stage.name }}
**Reviewer:** {{ stage.reviewer_type }}
**Focus:** {{ stage.focus }}
**Estimated Time:** {{ stage.estimated_time }}

{% if stage.blocking %}
🚫 **Blocking Stage** - Must pass before proceeding
{% endif %}

{% if stage.parallel %}
🔄 **Parallel Stage** - Can run concurrently with other stages
{% endif %}

**Template:** `{{ stage.template }}`
**Variables:**
```json
{{ stage.variables | tojson }}
```

---
{% endfor %}

## Review Completion Criteria
{% for criterion in completion_criteria %}
- {{ criterion }}
{% endfor %}

## Escalation Matrix
{% for escalation in escalation_matrix %}
**{{ escalation.condition }}**
- Contact: {{ escalation.contact }}
- Timeline: {{ escalation.timeline }}
- Action: {{ escalation.action }}
{% endfor %}
```

**Usage:**
```javascript
// Multi-stage review workflow
const reviewStages = [
  {
    name: 'Initial Architecture Review',
    reviewer_type: 'Senior Developer',
    focus: 'Architecture and design patterns',
    template: 'workflows/code-review/base-review.md.yapl',
    variables: {
      review_stage: 'initial',
      review_urgency: 'normal'
    },
    blocking: true,
    parallel: false
  },
  {
    name: 'Security Review',
    reviewer_type: 'Security Engineer',
    focus: 'Security vulnerabilities',
    template: 'workflows/code-review/security-review.md.yapl',
    variables: {
      review_stage: 'security',
      security_critical: true,
      language: 'javascript'
    },
    blocking: true,
    parallel: true
  },
  {
    name: 'Performance Review',
    reviewer_type: 'Performance Engineer',
    focus: 'Performance optimization',
    template: 'workflows/code-review/performance-review.md.yapl',
    variables: {
      review_stage: 'performance',
      application_type: 'web',
      load_testing_required: true
    },
    blocking: false,
    parallel: true
  }
];

const orchestrator = await yapl.render('workflows/code-review/review-orchestrator.md.yapl', {
  review_stages: reviewStages,
  completion_criteria: [
    'All blocking stages must pass',
    'Security review must be approved',
    'Performance impact must be acceptable'
  ],
  escalation_matrix: [
    {
      condition: 'Security issues found',
      contact: 'security-team@company.com',
      timeline: '24 hours',
      action: 'Block merge until resolved'
    }
  ]
});
```

## Example 2: Dynamic Content Generation Pipeline

This example shows how to create a content generation system that adapts based on audience, platform, and content type.

### Content Strategy Template

**File:** `workflows/content/strategy.md.yapl`
```yapl
# Content Strategy: {{ campaign_name }}

## Campaign Overview
- **Objective:** {{ objective }}
- **Target Audience:** {{ target_audience }}
- **Duration:** {{ start_date }} to {{ end_date }}
- **Budget:** {{ budget | default("TBD") }}

{% block audience_analysis %}
## Audience Analysis
{% if audience_segments %}
{% for segment in audience_segments %}
### {{ segment.name }}
- **Demographics:** {{ segment.demographics }}
- **Interests:** {{ segment.interests | join(", ") }}
- **Preferred Platforms:** {{ segment.platforms | join(", ") }}
- **Content Preferences:** {{ segment.content_preferences }}
- **Engagement Patterns:** {{ segment.engagement_patterns }}
{% endfor %}
{% endif %}
{% endblock %}

{% block content_pillars %}
## Content Pillars
{% for pillar in content_pillars %}
### {{ pillar.name }}
{{ pillar.description }}

**Key Messages:**
{% for message in pillar.key_messages %}
- {{ message }}
{% endfor %}

**Content Types:**
{% for type in pillar.content_types %}
- {{ type }}
{% endfor %}
{% endfor %}
{% endblock %}

{% block platform_strategy %}
## Platform Strategy
{% for platform in platforms %}
### {{ platform.name }}
{% include "components/platform-strategy.md.yapl" with {
  "platform": platform,
  "audience_segments": audience_segments,
  "content_pillars": content_pillars
} %}
{% endfor %}
{% endblock %}

{% block content_calendar %}
## Content Calendar Framework
{% include "components/content-calendar.md.yapl" with {
  "frequency": posting_frequency,
  "platforms": platforms,
  "content_types": content_types
} %}
{% endblock %}
```

### Platform-Specific Content Templates

**File:** `workflows/content/social-media-post.md.yapl`
```yapl
{% if platform == "twitter" %}
# Twitter Post

{% if post_type == "thread" %}
## Thread Structure
{% for tweet in thread_content %}
**Tweet {{ loop.index }}** ({{ tweet | length }}/280 characters)
{{ tweet }}

{% endfor %}

**Hashtags:** {{ hashtags | join(" ") }}
**Mentions:** {{ mentions | join(" ") }}

{% else %}
## Single Tweet
{{ content }}

**Character Count:** {{ content | length }}/280
**Hashtags:** {{ hashtags | join(" ") }}
**Mentions:** {{ mentions | join(" ") }}
{% endif %}

{% elif platform == "linkedin" %}
# LinkedIn Post

## Content
{{ content }}

{% if include_cta %}
## Call to Action
{{ cta_text }}
{% endif %}

**Hashtags:** {{ hashtags | join(" ") }}
**Target Audience:** {{ target_audience }}

{% elif platform == "instagram" %}
# Instagram Post

## Caption
{{ caption }}

## Visual Requirements
- **Image Specs:** {{ image_specs | default("1080x1080px") }}
- **Style:** {{ visual_style }}
- **Brand Elements:** {{ brand_elements | join(", ") }}

**Hashtags:** {{ hashtags | join(" ") }}
**Location Tag:** {{ location_tag }}

{% endif %}

## Engagement Strategy
{% if engagement_strategy %}
{% for strategy in engagement_strategy %}
- {{ strategy }}
{% endfor %}
{% endif %}

## Success Metrics
{% if success_metrics %}
{% for metric in success_metrics %}
- **{{ metric.name }}:** {{ metric.target }}
{% endfor %}
{% endif %}
```

### Content Generation Workflow

**File:** `workflows/content/generation-workflow.md.yapl`
```yapl
# Content Generation Workflow

## Content Brief
- **Topic:** {{ topic }}
- **Content Type:** {{ content_type }}
- **Target Platform:** {{ platform }}
- **Audience Segment:** {{ audience_segment }}
- **Content Pillar:** {{ content_pillar }}
- **Tone:** {{ tone }}
- **Length:** {{ target_length }}

{% block research_phase %}
## Research Phase
{% include "components/research-brief.md.yapl" with {
  "topic": topic,
  "audience": audience_segment,
  "competitors": competitors,
  "trending_topics": trending_topics
} %}
{% endblock %}

{% block content_creation %}
## Content Creation
{% if content_type == "blog_post" %}
{% include "templates/blog-post.md.yapl" with {
  "title": title,
  "topic": topic,
  "target_audience": audience_segment,
  "seo_keywords": seo_keywords,
  "word_count": target_length
} %}
{% elif content_type == "social_media" %}
{% include "workflows/content/social-media-post.md.yapl" with {
  "platform": platform,
  "content": content,
  "hashtags": hashtags,
  "engagement_strategy": engagement_strategy
} %}
{% elif content_type == "email" %}
{% include "templates/email-campaign.md.yapl" with {
  "subject_line": subject_line,
  "audience_segment": audience_segment,
  "personalization": personalization_data
} %}
{% endif %}
{% endblock %}

{% block optimization %}
## Content Optimization
{% if optimization_focus %}
### Optimization Areas
{% for area in optimization_focus %}
- **{{ area.name }}:** {{ area.description }}
  - Current: {{ area.current_performance }}
  - Target: {{ area.target_performance }}
  - Strategy: {{ area.optimization_strategy }}
{% endfor %}
{% endif %}

### A/B Testing Plan
{% if ab_testing %}
- **Variable:** {{ ab_testing.variable }}
- **Variant A:** {{ ab_testing.variant_a }}
- **Variant B:** {{ ab_testing.variant_b }}
- **Success Metric:** {{ ab_testing.success_metric }}
- **Test Duration:** {{ ab_testing.duration }}
{% endif %}
{% endblock %}

{% block distribution %}
## Distribution Strategy
{% for channel in distribution_channels %}
### {{ channel.name }}
- **Timing:** {{ channel.optimal_timing }}
- **Frequency:** {{ channel.frequency }}
- **Customization:** {{ channel.customization_notes }}
{% endfor %}

### Cross-Platform Coordination
{% if cross_platform_strategy %}
{{ cross_platform_strategy }}
{% endif %}
{% endblock %}

{% block measurement %}
## Success Measurement
### Key Performance Indicators
{% for kpi in kpis %}
- **{{ kpi.name }}:** {{ kpi.target }} ({{ kpi.measurement_method }})
{% endfor %}

### Reporting Schedule
- **Daily:** {{ daily_metrics | join(", ") }}
- **Weekly:** {{ weekly_metrics | join(", ") }}
- **Monthly:** {{ monthly_metrics | join(", ") }}

### Optimization Triggers
{% for trigger in optimization_triggers %}
- **If {{ trigger.condition }}:** {{ trigger.action }}
{% endfor %}
{% endblock %}
```

**Usage:**
```javascript
// Generate comprehensive content workflow
const contentWorkflow = await yapl.render('workflows/content/generation-workflow.md.yapl', {
  topic: 'AI in Healthcare',
  content_type: 'blog_post',
  platform: 'company_blog',
  audience_segment: 'healthcare_professionals',
  content_pillar: 'thought_leadership',
  tone: 'professional_authoritative',
  target_length: 2000,
  
  title: 'The Future of AI-Powered Diagnostics in Healthcare',
  seo_keywords: ['AI healthcare', 'medical diagnostics', 'machine learning'],
  
  optimization_focus: [
    {
      name: 'SEO Performance',
      current_performance: 'Page 3 ranking',
      target_performance: 'Page 1 ranking',
      optimization_strategy: 'Keyword optimization and backlink building'
    }
  ],
  
  ab_testing: {
    variable: 'headline',
    variant_a: 'The Future of AI-Powered Diagnostics in Healthcare',
    variant_b: 'How AI is Revolutionizing Medical Diagnostics',
    success_metric: 'click-through rate',
    duration: '2 weeks'
  },
  
  distribution_channels: [
    {
      name: 'Company Blog',
      optimal_timing: 'Tuesday 10 AM EST',
      frequency: 'Weekly',
      customization_notes: 'Full-length article with technical details'
    },
    {
      name: 'LinkedIn',
      optimal_timing: 'Wednesday 2 PM EST',
      frequency: 'Bi-weekly',
      customization_notes: 'Executive summary with link to full article'
    }
  ],
  
  kpis: [
    { name: 'Page Views', target: '5,000', measurement_method: 'Google Analytics' },
    { name: 'Engagement Rate', target: '15%', measurement_method: 'Social media analytics' },
    { name: 'Lead Generation', target: '50 qualified leads', measurement_method: 'CRM tracking' }
  ]
});
```

## Example 3: Adaptive Learning System

This example demonstrates a sophisticated educational system that adapts content based on learning progress and style.

### Learning Path Template

**File:** `workflows/education/learning-path.md.yapl`
```yapl
# Learning Path: {{ course_title }}

## Course Overview
- **Subject:** {{ subject }}
- **Level:** {{ difficulty_level }}
- **Duration:** {{ estimated_duration }}
- **Prerequisites:** {{ prerequisites | join(", ") }}

{% block learner_profile %}
## Learner Profile
- **Name:** {{ learner.name }}
- **Experience Level:** {{ learner.experience_level }}
- **Learning Style:** {{ learner.learning_style }}
- **Preferred Pace:** {{ learner.preferred_pace }}
- **Available Time:** {{ learner.available_time_per_week }} hours/week
- **Goals:** {{ learner.goals | join(", ") }}

### Learning Preferences
{% if learner.preferences %}
{% for preference in learner.preferences %}
- **{{ preference.category }}:** {{ preference.value }}
{% endfor %}
{% endif %}
{% endblock %}

{% block adaptive_curriculum %}
## Adaptive Curriculum

{% for module in modules %}
### Module {{ loop.index }}: {{ module.title }}
{% include "components/learning-module.md.yapl" with {
  "module": module,
  "learner": learner,
  "progress": progress.modules[loop.index0] if progress else {},
  "adaptation_rules": adaptation_rules
} %}
{% endfor %}
{% endblock %}

{% block progress_tracking %}
## Progress Tracking
{% if progress %}
### Current Progress
- **Overall Completion:** {{ progress.overall_percentage }}%
- **Current Module:** {{ progress.current_module }}
- **Mastery Score:** {{ progress.mastery_score }}/100
- **Time Invested:** {{ progress.time_invested }} hours

### Performance Analytics
{% for metric in progress.performance_metrics %}
- **{{ metric.name }}:** {{ metric.value }} ({{ metric.trend }})
{% endfor %}

### Adaptation Triggers
{% for trigger in progress.adaptation_triggers %}
- **{{ trigger.condition }}:** {{ trigger.action_taken }}
{% endfor %}
{% endif %}
{% endblock %}

{% block personalization %}
## Personalization Rules

### Content Adaptation
{% if learner.learning_style == "visual" %}
- Prioritize diagrams, infographics, and visual examples
- Include video content and interactive demonstrations
- Use mind maps and flowcharts for complex concepts
{% elif learner.learning_style == "auditory" %}
- Include audio explanations and podcasts
- Provide discussion opportunities and verbal exercises
- Use storytelling and verbal analogies
{% elif learner.learning_style == "kinesthetic" %}
- Include hands-on exercises and simulations
- Provide interactive labs and practical projects
- Use real-world applications and case studies
{% endif %}

### Pacing Adaptation
{% if learner.preferred_pace == "accelerated" %}
- Reduce repetition and review time
- Provide advanced challenges and extensions
- Allow module skipping with competency demonstration
{% elif learner.preferred_pace == "standard" %}
- Follow recommended pacing guidelines
- Include standard review and practice time
- Provide optional enrichment activities
{% else %}
- Increase review and practice opportunities
- Break content into smaller chunks
- Provide additional support resources
{% endif %}

### Difficulty Adjustment
{% if progress and progress.mastery_score < 70 %}
- Provide additional practice exercises
- Include remedial content and explanations
- Offer one-on-one tutoring opportunities
{% elif progress and progress.mastery_score > 90 %}
- Introduce advanced topics and challenges
- Provide leadership and mentoring opportunities
- Offer independent research projects
{% endif %}
{% endblock %}

{% block assessment_strategy %}
## Assessment Strategy

### Formative Assessments
{% for assessment in formative_assessments %}
- **{{ assessment.type }}:** {{ assessment.description }}
  - Frequency: {{ assessment.frequency }}
  - Adaptation: {{ assessment.adaptation_rule }}
{% endfor %}

### Summative Assessments
{% for assessment in summative_assessments %}
- **{{ assessment.type }}:** {{ assessment.description }}
  - Weight: {{ assessment.weight }}%
  - Passing Score: {{ assessment.passing_score }}%
{% endfor %}

### Adaptive Assessment Rules
{% for rule in adaptive_assessment_rules %}
- **If {{ rule.condition }}:** {{ rule.action }}
{% endfor %}
{% endblock %}
```

**Usage:**
```javascript
// Generate personalized learning path
const learningPath = await yapl.render('workflows/education/learning-path.md.yapl', {
  course_title: 'Advanced JavaScript Programming',
  subject: 'Web Development',
  difficulty_level: 'Intermediate to Advanced',
  estimated_duration: '12 weeks',
  prerequisites: ['Basic JavaScript', 'HTML/CSS', 'Git basics'],
  
  learner: {
    name: 'Alex Johnson',
    experience_level: 'intermediate',
    learning_style: 'kinesthetic',
    preferred_pace: 'accelerated',
    available_time_per_week: 10,
    goals: ['Master async programming', 'Learn modern frameworks', 'Build portfolio projects'],
    preferences: [
      { category: 'Content Format', value: 'Interactive coding exercises' },
      { category: 'Feedback Style', value: 'Immediate and detailed' },
      { category: 'Challenge Level', value: 'High with support' }
    ]
  },
  
  modules: [
    {
      title: 'Advanced Functions and Closures',
      concepts: ['Higher-order functions', 'Closures', 'Function composition'],
      estimated_time: '2 weeks',
      difficulty: 'intermediate'
    },
    {
      title: 'Asynchronous JavaScript',
      concepts: ['Promises', 'Async/await', 'Event loop'],
      estimated_time: '3 weeks',
      difficulty: 'advanced'
    }
  ],
  
  progress: {
    overall_percentage: 35,
    current_module: 'Advanced Functions and Closures',
    mastery_score: 85,
    time_invested: 25,
    performance_metrics: [
      { name: 'Exercise Completion Rate', value: '92%', trend: 'improving' },
      { name: 'Average Quiz Score', value: '87%', trend: 'stable' }
    ],
    adaptation_triggers: [
      { condition: 'High performance in current module', action: 'Unlocked advanced challenges' }
    ]
  }
});
```

## Key Workflow Patterns

These examples demonstrate several important workflow patterns:

1. **Multi-Stage Processing**: Breaking complex workflows into manageable stages
2. **Conditional Branching**: Different paths based on context and requirements
3. **Template Orchestration**: Coordinating multiple templates for complex outputs
4. **Adaptive Behavior**: Changing behavior based on user data and progress
5. **Hierarchical Organization**: Organizing templates in logical hierarchies
6. **Cross-Template Communication**: Passing data between related templates
7. **Dynamic Configuration**: Runtime configuration of workflow behavior
8. **Progress Tracking**: Maintaining state across workflow stages
9. **Escalation Handling**: Defining escalation paths for different scenarios
10. **Performance Optimization**: Balancing thoroughness with efficiency

These patterns can be adapted and combined to create sophisticated workflow systems for any domain, from business processes to educational systems to content management pipelines.