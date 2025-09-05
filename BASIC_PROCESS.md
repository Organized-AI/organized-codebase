# ASCII Wireframes as a Development Workflow

## Overview
ASCII wireframes are a simple, text-based method of creating visual layouts and user interface mockups using only keyboard characters. This document serves as a guide for implementing ASCII wireframes in your development workflow.

## What Are ASCII Wireframes?

ASCII wireframes use basic characters like:
- `|` (pipes) for vertical lines
- `-` (dashes) for horizontal lines  
- `+` (plus signs) for corners
- `[ ]` (brackets) for buttons
- `___` (underscores) for input fields
- `#` or `*` for content areas

### Simple Example:
```
+---------------------------+
|         Header            |
+---------------------------+
| [Menu] [About] [Contact]  |
+---------------------------+
|                          |
|    Main Content Area     |
|                          |
|  +-------------------+   |
|  |   Sidebar         |   |
|  |                   |   |
|  +-------------------+   |
|                          |
+---------------------------+
|        Footer            |
+---------------------------+
```

## Why Use ASCII Wireframes?

### 1. Speed and Simplicity
- No special software needed - just any text editor
- Create wireframes in seconds, not minutes
- Perfect for quick brainstorming sessions
- Can be done during calls or meetings

### 2. Focus on Structure Over Aesthetics
- Forces you to think about layout and functionality first
- Removes distractions of colors, fonts, and visual design
- Helps stakeholders focus on content and flow rather than visual details

### 3. Version Control Friendly
- Plain text files work perfectly with Git
- Easy to see changes in diffs
- Can be included directly in documentation
- Searchable and lightweight

### 4. Universal Accessibility
- Works on any device or platform
- Can be shared via email, chat, or comments
- No proprietary file formats
- Screen reader friendly

## ASCII Wireframes in Development Workflow

### 1. Initial Planning Phase
```
User Story: As a user, I want to login to access my dashboard

+------------------------+
|       Login Page       |
+------------------------+
| Email: [____________] |
| Pass:  [____________] |
|                       |
|      [Login Button]   |
|                       |
| [Forgot Password?]    |
+------------------------+
```

### 2. Feature Planning
Before writing code, quickly sketch the component structure:
```
Dashboard Component
+----------------------------------+
| Header: [Logo] [Nav] [User Menu] |
+----------------------------------+
| Sidebar    |   Main Content      |
| +--------+ | +------------------+|
| |Nav     | | |  Widget 1        ||
| |Items   | | +------------------+|
| |        | | |  Widget 2        ||
| +--------+ | +------------------+|
+----------------------------------+
```

### 3. API Planning
Map out data flow and component relationships:
```
Frontend          API              Database
+----------+     +-------+        +-----------+
| Login    | --> | /auth | -----> | users     |
| Form     |     +-------+        | table     |
+----------+                      +-----------+
     |
     v
+----------+     +-------+        +-----------+
|Dashboard | --> | /user | -----> | user_data |
|Component |     | /data |        | table     |
+----------+     +-------+        +-----------+
```

## Advanced ASCII Wireframe Techniques

### Mobile-First Approach
```
Mobile View:
+-------------+
|   Header    |
+-------------+
| [☰ Menu]   |
+-------------+
|            |
|  Content   |
|            |
+-------------+

Desktop View:
+----------------------------------------+
|              Header                    |
+----------------------------------------+
| Menu | Main Content     | Sidebar     |
|      |                 |             |
|      |                 |             |
+----------------------------------------+
```

### Form Layouts
```
Contact Form:
+---------------------------+
| Name:     [____________] |
| Email:    [____________] |
| Subject:  [____________] |
| Message:                 |
| +---------------------+ |
| |                     | |
| |                     | |
| |                     | |
| +---------------------+ |
|                         |
|      [Submit] [Reset]   |
+---------------------------+
```

### Data Tables
```
User Management:
+------+---------------+----------+--------+
| ID   | Name          | Email    | Action |
+------+---------------+----------+--------+
| 001  | John Doe      | j@doe... | [Edit] |
| 002  | Jane Smith    | j@smi... | [Edit] |
| 003  | Bob Johnson   | b@joh... | [Edit] |
+------+---------------+----------+--------+
| [<Prev]  Page 1 of 5      [Next>] |
+------------------------------------+
```

## Best Practices

### 1. Start Simple
- Begin with basic boxes and labels
- Add detail gradually
- Don't try to make it "pretty" - focus on functionality

### 2. Use Consistent Symbols
```
Conventions:
[ ] = Button
___ = Input field
||| = List items
+++ = Important sections
*** = Content areas
```

### 3. Include Annotations
```
+------------------+
| Search Results   | <-- Page title
+------------------+
| [Filter] [Sort]  | <-- Action bar
+------------------+
| * Result 1       | <-- Dynamic content
| * Result 2       |     (populated from API)
| * Result 3       |
+------------------+
| [Load More]      | <-- Pagination
+------------------+
```

### 4. Think Responsive
Always consider how your layout adapts:
```
Desktop: [Header] [Nav] [Main] [Sidebar]
Tablet:  [Header] [Nav] [Main + Sidebar]
Mobile:  [Header]
         [☰ Nav]
         [Main]
         [Sidebar below]
```

## When to Use ASCII Wireframes vs Other Tools

**Use ASCII When:**
- Quick brainstorming or concept validation
- Documenting technical architecture
- Planning component structure
- Working in text-based environments
- Need to include wireframes in code comments

**Use Other Tools When:**
- Presenting to non-technical stakeholders
- Need precise visual specifications
- Creating detailed UI specifications
- Planning complex interactions or animations

## Integration with Development Tools

### In Code Comments
```javascript
/**
 * UserProfile Component Layout:
 * +------------------------+
 * | [Avatar] Name          |
 * |          Email         |
 * |          [Edit Button] |
 * +------------------------+
 */
function UserProfile({ user }) {
  // Implementation here
}
```

### In Documentation
ASCII wireframes work great in README files, technical specs, and planning documents.

### In Issue Tracking
Perfect for GitHub issues, Jira tickets, or bug reports to quickly show expected vs actual layout.

## Organized Codebase Integration

This approach aligns with the Organized Codebase methodology by:

1. **Rapid Prototyping**: Quick visualization without tool overhead
2. **Documentation First**: ASCII wireframes serve as living documentation
3. **Version Control**: Plain text integrates seamlessly with Git workflows
4. **Accessibility**: Universal format readable by all team members
5. **Focus on Structure**: Emphasizes architectural thinking over visual design

## Claude Code Integration

When using Claude Code for development, include ASCII wireframes in your prompts:

```bash
claude --dangerously-skip-permissions
```

Example prompt structure:
```
Please implement this component based on the following ASCII wireframe:

+------------------------+
| [Avatar] Name          |
|          Email         |
|          [Edit Button] |
+------------------------+

Requirements:
- Responsive design
- Accessible markup
- Clean, semantic HTML
```

---

*This document is part of the Organized Codebase methodology for structured development workflows.*
