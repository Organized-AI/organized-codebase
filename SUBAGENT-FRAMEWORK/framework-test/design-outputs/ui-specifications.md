# UI Specifications: Simple Todo App

## Design Philosophy
- **Minimalist**: Clean, uncluttered interface focusing on task management
- **Intuitive**: No learning curve - immediately obvious how to use
- **Accessible**: Keyboard navigation and screen reader friendly
- **Responsive**: Mobile-first design that scales to desktop

## Visual Design System

### Color Palette
- Primary: #3B82F6 (Blue-500) - Action buttons, active states
- Secondary: #6B7280 (Gray-500) - Secondary text, borders  
- Success: #10B981 (Green-500) - Completed tasks, success states
- Danger: #EF4444 (Red-500) - Delete actions, error states
- Background: #F9FAFB (Gray-50) - App background
- Surface: #FFFFFF - Task cards, input fields
- Text Primary: #111827 (Gray-900) - Main text
- Text Secondary: #6B7280 (Gray-500) - Timestamps, descriptions

### Typography
- Font Family: Inter (system fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- H1: 24px, font-semibold - App title
- H2: 18px, font-medium - Section headers  
- Body: 16px, font-normal - Task titles
- Small: 14px, font-normal - Descriptions, timestamps
- Caption: 12px, font-medium - Labels, counts

### Spacing System
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

## Component Specifications

### Task Item Component
```
┌─────────────────────────────────────────────────────┐
│ [☐] Task Title Here                        [🗑️] │
│     Optional description text here...               │
│     Created 2 hours ago                            │
└─────────────────────────────────────────────────────┘

States:
- Default: White background, gray border
- Hover: Light blue background, blue border
- Completed: Strikethrough text, green checkmark, gray background
- Editing: Blue border, focus ring, inline input
```

### Add Task Form
```
┌─────────────────────────────────────────────────────┐
│ ➕ Add new task...                        [+] Add  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Optional description...                         │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

States:
- Collapsed: Single input line with placeholder
- Expanded: Title + description fields when title has content
- Submitting: Disabled state with loading indicator
```

### App Header
```
┌─────────────────────────────────────────────────────┐
│ 📝 Simple Todo                     5 tasks, 2 done │
└─────────────────────────────────────────────────────┘
```

## Wireframes

### Mobile Layout (320px+)
```
┌─────────────────┐
│ 📝 Simple Todo  │
│ 3 tasks, 1 done │
├─────────────────┤
│ ➕ Add task...  │
│ [expand area]   │
├─────────────────┤
│ [☐] Buy milk    │
│     Grocery...  │
│     2h ago      │
├─────────────────┤
│ [✅] Walk dog    │
│     Exercise... │
│     4h ago      │
├─────────────────┤
│ [☐] Code review │
│     Check PR... │
│     1h ago      │
└─────────────────┘
```

### Desktop Layout (768px+)
```
┌─────────────────────────────────────────────────────┐
│ 📝 Simple Todo                     5 tasks, 2 done │
├─────────────────────────────────────────────────────┤
│ ➕ Add new task...                        [+] Add  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Optional description...                         │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ [☐] Buy groceries for the week           [🗑️] │
│     Need milk, bread, eggs, and vegetables          │
│     Created 2 hours ago                            │
├─────────────────────────────────────────────────────┤
│ [✅] Complete project documentation        [🗑️] │
│     Finish API docs and user guide                 │
│     Created 4 hours ago                            │
├─────────────────────────────────────────────────────┤
│ [☐] Schedule team meeting                 [🗑️] │
│     Weekly planning and retrospective              │
│     Created 1 hour ago                             │
└─────────────────────────────────────────────────────┘
```

## User Flow Diagrams

### Primary User Flow: Add Task
1. User sees add task input at top
2. Clicks input → gains focus, placeholder changes to "What needs to be done?"
3. Types task title → description field appears below
4. Optionally adds description
5. Presses Enter or clicks Add button → task appears in list
6. Form resets to initial state

### Secondary Flow: Complete Task
1. User sees uncompleted task
2. Clicks checkbox → immediate visual feedback
3. Task moves to completed section (future) or shows completed styling
4. Data persists to local storage

### Tertiary Flow: Edit Task
1. User double-clicks task title → enters edit mode
2. Text becomes editable input with current value
3. User modifies text
4. Presses Enter or clicks outside → saves changes
5. Presses Escape → cancels changes

## Responsive Behavior

### Mobile (320px - 767px)
- Single column layout
- Full-width task items
- Simplified task display (hide timestamps on very small screens)
- Touch-friendly target sizes (44px minimum)
- Collapsible description form

### Tablet (768px - 1023px)  
- Single column with more padding
- Show all task details
- Larger text for better readability
- Side-by-side form layout when space allows

### Desktop (1024px+)
- Maximum width container (768px) for readability
- Full feature set visible
- Hover states for interactive elements
- Keyboard shortcuts (future enhancement)

## Accessibility Requirements

### Keyboard Navigation
- Tab order: Header → Add form → Task list (top to bottom)
- Enter: Submit forms, toggle task completion
- Space: Toggle checkboxes
- Escape: Cancel edit mode
- Arrow keys: Navigate between tasks (future)

### Screen Reader Support
- Semantic HTML: header, main, section, article elements
- ARIA labels: "Mark task as complete", "Delete task", "Edit task"
- Live regions: Announce task additions/completions
- Descriptive link text: No "click here" or generic text

### Visual Accessibility
- Color contrast: 4.5:1 minimum for normal text, 3:1 for large text
- Focus indicators: 2px blue outline on all interactive elements
- Text scaling: Support up to 200% zoom without horizontal scrolling
- Motion: Respect prefers-reduced-motion for animations

## Implementation Notes

### CSS Framework: Tailwind CSS
- Use utility classes for consistency
- Custom components for complex patterns
- Responsive prefixes: sm:, md:, lg:, xl:
- Dark mode ready (future enhancement)

### Component Library Structure
```
components/
├── ui/
│   ├── Button.tsx        # Reusable button component
│   ├── Input.tsx         # Form input component  
│   ├── Checkbox.tsx      # Accessible checkbox
│   └── Card.tsx          # Task container
├── features/
│   ├── TaskItem.tsx      # Individual task display
│   ├── TaskList.tsx      # Task container and list
│   ├── AddTaskForm.tsx   # New task creation
│   └── TaskStats.tsx     # Header stats display
└── layout/
    ├── AppHeader.tsx     # App title and stats
    └── AppLayout.tsx     # Main layout wrapper
```

This UI specification provides clear guidance for implementing a clean, accessible, and user-friendly todo application that demonstrates the subagent framework's capabilities.
