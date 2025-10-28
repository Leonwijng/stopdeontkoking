# Color Palette

### Primary Colors

- **Primary Green**: `#10b981` (Emerald-500)

- Use for: Primary CTAs, key headlines, active states
- Represents: Fresh ingredients, health, growth



- **Primary Dark**: `#059669` (Emerald-600)

- Use for: Hover states, emphasis, borders



- **Accent Lime**: `#84cc16` (Lime-500)

- Use for: Secondary accents, highlights, playful elements
- Represents: Energy, vibrancy, youth





### Neutral Colors

- **Background**: `#fafaf9` (Stone-50)
- **Card Background**: `#ffffff` (White)
- **Text Primary**: `#1c1917` (Stone-900)
- **Text Secondary**: `#57534e` (Stone-600)
- **Text Muted**: `#78716c` (Stone-500)


### Semantic Colors

- **Success**: `#10b981` (Emerald-500)
- **Border**: `#e7e5e4` (Stone-200)


---

## Typography

### Font Families

- **Headings**: System Sans-Serif Stack
- **Body**: System Sans-Serif Stack
- **Monospace**: System Monospace Stack (for stats/numbers)


### Type Scale

- **Hero Headline**: `text-6xl md:text-7xl lg:text-8xl` (60px → 72px → 96px)

- Weight: `font-bold` (700)
- Line Height: `leading-tight`



- **Section Headline**: `text-4xl md:text-5xl lg:text-6xl` (36px → 48px → 60px)

- Weight: `font-bold` (700)
- Line Height: `leading-tight`



- **Subheadline**: `text-xl md:text-2xl` (20px → 24px)

- Weight: `font-medium` (500)
- Line Height: `leading-relaxed`



- **Body Large**: `text-lg md:text-xl` (18px → 20px)

- Weight: `font-normal` (400)
- Line Height: `leading-relaxed`



- **Body**: `text-base` (16px)

- Weight: `font-normal` (400)
- Line Height: `leading-relaxed`



- **Small**: `text-sm` (14px)

- Weight: `font-normal` (400)





### Typography Guidelines

- Always use `text-balance` for headlines to prevent awkward line breaks
- Use `leading-relaxed` (1.625) for body text for optimal readability
- Maintain strong contrast between text and background (WCAG AA minimum)


---

## Spacing System

### Container Widths

- **Max Width**: `max-w-7xl` (1280px)
- **Content Width**: `max-w-4xl` (896px) for text-heavy sections
- **Narrow Width**: `max-w-2xl` (672px) for forms and CTAs


### Padding Scale

- **Section Padding**: `py-16 md:py-24 lg:py-32`
- **Container Padding**: `px-4 md:px-6 lg:px-8`
- **Card Padding**: `p-6 md:p-8`
- **Button Padding**: `px-8 py-4`


### Gap Scale

- **Large Gap**: `gap-12 md:gap-16` (between major sections)
- **Medium Gap**: `gap-8 md:gap-12` (between related elements)
- **Small Gap**: `gap-4 md:gap-6` (between tight elements)
- **Tight Gap**: `gap-2` (between inline elements)


---

## Components

### Buttons

**Primary Button**

```plaintext
- Background: bg-primary (green)
- Text: text-white
- Padding: px-8 py-4
- Border Radius: rounded-full
- Font: text-lg font-semibold
- Hover: scale-105 + brightness adjustment
- Transition: all 300ms
```

**Secondary Button**

```plaintext
- Background: bg-white
- Text: text-primary
- Border: 2px solid primary
- Padding: px-8 py-4
- Border Radius: rounded-full
- Font: text-lg font-semibold
- Hover: bg-primary + text-white
```

### Cards

**Stat Card**

```plaintext
- Background: bg-white
- Border Radius: rounded-3xl
- Padding: p-6
- Shadow: shadow-lg
- Border: 2px solid primary
- Animation: floating (subtle up/down)
```

**Benefit Card**

```plaintext
- Background: bg-white
- Border Radius: rounded-2xl
- Padding: p-8
- Shadow: shadow-md
- Hover: scale-105 + shadow-xl
- Transition: all 300ms
```

**Food Card**

```plaintext
- Border Radius: rounded-3xl
- Overflow: hidden
- Aspect Ratio: aspect-square
- Hover: scale-105 + brightness-110
- Transition: all 500ms
```

### Icons

- **Size**: 24px (w-6 h-6) for inline icons
- **Size**: 48px (w-12 h-12) for feature icons
- **Color**: text-primary or text-accent
- **Stroke Width**: 2px


---

## Animations

### Timing Functions

- **Standard**: `transition-all duration-300 ease-in-out`
- **Slow**: `transition-all duration-500 ease-in-out`
- **Bounce**: `hover:scale-105` with transition


### Animation Patterns

**Floating Animation**

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) }
  50% { transform: translateY(-10px) }
}
animation: float 3s ease-in-out infinite
```

**Fade In Up**

```plaintext
- Initial: opacity-0 translate-y-4
- Animate: opacity-100 translate-y-0
- Timing: duration-700
```

**Hover Scale**

```plaintext
- Transform: scale-105
- Timing: duration-300
```

---

## Layout Principles

### Alignment

- **Primary**: Center-aligned for all major content
- **Text**: Center-aligned headlines and body copy
- **CTAs**: Center-aligned with centered buttons


### Grid Systems

- **Benefits Grid**: 1 column mobile → 2 columns tablet → 3 columns desktop
- **Food Showcase**: 2 columns mobile → 3 columns tablet → 4 columns desktop
- **Stats**: Horizontal scroll mobile → 3 columns desktop


### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px


---

## Voice & Tone

### Writing Style

- **Conversational**: Speak directly to Gen Z ("You're spending how much?")
- **Authentic**: Avoid corporate jargon and overly promotional language
- **Empowering**: Focus on capability and independence
- **Energetic**: Use active voice and dynamic language
- **No Emojis**: Keep it clean and modern


### Content Guidelines

- Lead with benefits, not features
- Use specific numbers and data points
- Address real pain points (money, time, health)
- Keep paragraphs short and scannable
- Use strong, action-oriented headlines


---

## Accessibility

### Contrast Ratios

- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text on background: Minimum 3:1
- Interactive elements: Clear focus states


### Interactive Elements

- Minimum touch target: 44x44px
- Clear hover and focus states
- Keyboard navigable
- Screen reader friendly labels


---

## Usage Examples

### Hero Section

- Large centered headline with green accent
- Subheadline in muted text
- Primary CTA button in green
- Floating stat cards below


### Content Sections

- Centered headline with green color
- Centered body text with max-width constraint
- Generous vertical spacing between sections
- White cards on light background
