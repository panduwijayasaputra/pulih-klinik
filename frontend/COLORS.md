# Color Palette Reference

This document outlines the color palette used in the Smart Therapy application, inspired by the Finova design system.

## Primary Colors

### Blue Primary (`primary-*`)
- **primary-50**: `#eff6ff` - Very light blue background
- **primary-100**: `#dbeafe` - Light blue background
- **primary-200**: `#bfdbfe` - Light blue border/background
- **primary-300**: `#93c5fd` - Medium light blue
- **primary-400**: `#60a5fa` - Medium blue
- **primary-500**: `#3b82f6` - Main blue (primary brand color)
- **primary-600**: `#2563eb` - Darker blue for hover states
- **primary-700**: `#1d4ed8` - Even darker blue
- **primary-800**: `#1e40af` - Very dark blue
- **primary-900**: `#1e3a8a` - Darkest blue
- **primary-950**: `#172554` - Near black blue

### Gray Secondary (`secondary-*`)
- **secondary-50**: `#f8fafc` - Very light gray
- **secondary-100**: `#f1f5f9` - Light gray background
- **secondary-200**: `#e2e8f0` - Light gray border
- **secondary-300**: `#cbd5e1` - Medium light gray
- **secondary-400**: `#94a3b8` - Medium gray
- **secondary-500**: `#64748b` - Main gray (secondary brand color)
- **secondary-600**: `#475569` - Darker gray
- **secondary-700**: `#334155` - Even darker gray
- **secondary-800**: `#1e293b` - Very dark gray
- **secondary-900**: `#0f172a` - Darkest gray
- **secondary-950**: `#020617` - Near black gray

### Light Blue Accent (`accent-*`)
- **accent-50**: `#f0f9ff` - Very light blue accent
- **accent-100**: `#e0f2fe` - Light blue accent
- **accent-200**: `#bae6fd` - Light blue accent border
- **accent-300**: `#7dd3fc` - Medium light blue accent
- **accent-400**: `#38bdf8` - Medium blue accent
- **accent-500**: `#0ea5e9` - Main blue accent
- **accent-600**: `#0284c7` - Darker blue accent
- **accent-700**: `#0369a1` - Even darker blue accent
- **accent-800**: `#075985` - Very dark blue accent
- **accent-900**: `#0c4a6e` - Darkest blue accent
- **accent-950**: `#082f49` - Near black blue accent

## Semantic Colors

### Success (`success-*`)
- **success-500**: `#22c55e` - Green for success states
- Used for: Completed actions, positive feedback, success messages

### Warning (`warning-*`)
- **warning-500**: `#f59e0b` - Amber for warning states
- Used for: Warnings, pending actions, attention needed

### Info (`info-*`)
- **info-500**: `#3b82f6` - Blue for informational states
- Used for: Information messages, neutral feedback

### Destructive (`destructive-*`)
- **destructive-500**: `#ef4444` - Red for destructive actions
- Used for: Delete actions, errors, critical warnings

## Usage Guidelines

### Primary Actions
- Use `primary-500` for main call-to-action buttons
- Use `primary-600` for hover states
- Use `primary-50` for subtle backgrounds

### Secondary Actions
- Use `secondary-500` for secondary buttons and text
- Use `secondary-100` for card backgrounds
- Use `secondary-200` for borders

### Accent Elements
- Use `accent-500` for highlights and special elements
- Use `accent-100` for subtle accent backgrounds

### Status Indicators
- Use semantic colors for status badges and alerts
- Success: `success-500`
- Warning: `warning-500`
- Info: `info-500`
- Error: `destructive-500`

### Text Colors
- Primary text: `secondary-900`
- Secondary text: `secondary-600`
- Muted text: `secondary-500`
- Light text on dark backgrounds: `secondary-50`

## CSS Variables

The colors are also available as CSS custom properties:

```css
--primary: 217 91% 60%;
--secondary: 210 40% 96%;
--accent: 199 89% 48%;
--success: 142 76% 36%;
--warning: 48 100% 67%;
--error: 0 84.2% 60.2%;
--info: 217 91% 60%;
```

## Examples

### Button Variants
```tsx
// Primary button
<Button className="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Action
</Button>

// Secondary button
<Button className="bg-secondary-100 hover:bg-secondary-200 text-secondary-900">
  Secondary Action
</Button>

// Accent button
<Button className="bg-accent-500 hover:bg-accent-600 text-white">
  Accent Action
</Button>
```

### Badge Variants
```tsx
// Success badge
<Badge className="bg-success-100 text-success-700 border-success-200">
  Success
</Badge>

// Warning badge
<Badge className="bg-warning-100 text-warning-700 border-warning-200">
  Warning
</Badge>

// Info badge
<Badge className="bg-info-100 text-info-700 border-info-200">
  Info
</Badge>
```

### Card Backgrounds
```tsx
// Main card
<Card className="bg-white border-secondary-200">
  Content
</Card>

// Subtle background
<div className="bg-secondary-50">
  Subtle background
</div>

// Accent background
<div className="bg-accent-50">
  Accent background
</div>
``` 