# Component Architecture: Simple Todo App

## Architecture Overview
Based on the UI specifications and local storage integration requirements, this document defines the complete component hierarchy and data flow patterns for the Simple Todo application.

## Component Hierarchy

### Application Structure
```
App
├── AppLayout
│   ├── AppHeader
│   │   └── TaskStats
│   └── main
│       ├── AddTaskForm
│       │   ├── TaskInput
│       │   └── TaskDescriptionInput
│       └── TaskList
│           └── TaskItem[]
│               ├── TaskCheckbox
│               ├── TaskContent
│               │   ├── TaskTitle (editable)
│               │   ├── TaskDescription
│               │   └── TaskTimestamp
│               └── TaskActions
│                   └── DeleteButton
```

## Component Specifications

### 1. Core Layout Components

#### AppLayout
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}

// Responsibilities:
// - Provides main application structure
// - Handles responsive layout breakpoints
// - Manages global error boundaries
// - Sets up accessibility landmarks
```

#### AppHeader  
```typescript
interface AppHeaderProps {
  taskCount: number;
  completedCount: number;
}

// Responsibilities:
// - Displays app title and branding
// - Shows task statistics
// - Provides future navigation space
// - Maintains consistent top-level layout
```

#### TaskStats
```typescript
interface TaskStatsProps {
  total: number;
  completed: number;
  loading?: boolean;
}

// Responsibilities:
// - Displays formatted task counts
// - Shows completion percentage
// - Handles loading states
// - Provides accessibility announcements
```

### 2. Task Management Components

#### TaskList
```typescript
interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
}

// Responsibilities:
// - Renders list of TaskItem components
// - Handles empty state display
// - Manages loading and error states
// - Provides keyboard navigation
// - Implements virtualization for large lists (future)
```

#### TaskItem
```typescript
interface TaskItemProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
  onDelete: () => Promise<void>;
  isEditing?: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
}

// Responsibilities:
// - Displays individual task information
// - Handles inline editing functionality
// - Manages task completion toggling
// - Provides task deletion with confirmation
// - Implements hover and focus states
```

#### AddTaskForm
```typescript
interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loading?: boolean;
}

// Responsibilities:
// - Handles new task creation
// - Manages form state and validation
// - Provides expandable description field
// - Implements keyboard shortcuts (Enter to submit, Escape to cancel)
// - Shows loading states during submission
```

### 3. UI Foundation Components

#### TaskInput
```typescript
interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  maxLength?: number;
}

// Responsibilities:
// - Provides accessible text input
// - Handles validation and character limits
// - Implements keyboard navigation
// - Shows validation states
// - Supports inline and form modes
```

#### TaskCheckbox
```typescript
interface TaskCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

// Responsibilities:
// - Provides accessible checkbox input
// - Handles visual state changes
// - Implements proper ARIA attributes
// - Supports keyboard interaction
// - Shows loading states during updates
```

#### Button
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

// Responsibilities:
// - Provides consistent button styling
// - Handles loading and disabled states
// - Implements proper accessibility
// - Supports multiple variants and sizes
// - Manages focus and hover states
```

## Data Flow Architecture

### State Management Strategy
```typescript
// App-level State Structure
interface AppState {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  editingTaskId: string | null;
}

// Context Providers
interface TodoContextValue {
  // State
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  
  // Actions
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
  
  // UI State
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
}
```

### Custom Hooks

#### useTaskManager
```typescript
function useTaskManager() {
  // Integrates with storage client
  // Manages CRUD operations
  // Handles error states
  // Provides optimistic updates
  
  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    clearAllTasks
  };
}
```

#### useTaskForm
```typescript
function useTaskForm(onSubmit: (task: TaskFormData) => Promise<void>) {
  // Manages form state and validation
  // Handles submission and reset
  // Provides form validation
  // Manages loading states
  
  return {
    values,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset
  };
}
```

#### useTaskEdit
```typescript
function useTaskEdit(task: Task, onSave: (updates: Partial<Task>) => Promise<void>) {
  // Manages inline editing state
  // Handles save/cancel actions
  // Provides validation
  // Manages keyboard shortcuts
  
  return {
    isEditing,
    editValues,
    startEdit,
    saveEdit,
    cancelEdit,
    handleKeyDown
  };
}
```

## Component Communication Patterns

### Props Down, Events Up
```typescript
// Parent passes data down through props
<TaskList 
  tasks={tasks}
  onUpdateTask={handleUpdateTask}
  onDeleteTask={handleDeleteTask}
/>

// Child communicates changes through callbacks
const TaskItem = ({ task, onUpdate, onDelete }) => {
  const handleToggleComplete = () => {
    onUpdate({ completed: !task.completed });
  };
  
  return (
    <div>
      <TaskCheckbox 
        checked={task.completed}
        onChange={handleToggleComplete}
      />
      {/* ... */}
    </div>
  );
};
```

### Context for Global State
```typescript
// TodoProvider wraps app with global state
<TodoProvider>
  <App />
</TodoProvider>

// Components access global state through context
const TaskStats = () => {
  const { tasks } = useTodoContext();
  const completed = tasks.filter(t => t.completed).length;
  
  return <div>{completed} of {tasks.length} completed</div>;
};
```

### Event-Driven Updates
```typescript
// Storage events for cross-tab synchronization
useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.TASKS) {
      // Reload tasks from updated storage
      loadTasks();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

## Performance Optimization Patterns

### Memoization Strategy
```typescript
// Memoize expensive calculations
const taskStats = useMemo(() => {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage };
}, [tasks]);

// Memoize callbacks to prevent unnecessary re-renders
const handleUpdateTask = useCallback(async (id: string, updates: Partial<Task>) => {
  await updateTask(id, updates);
}, [updateTask]);

// Memoize components with stable props
const MemoizedTaskItem = memo(TaskItem, (prevProps, nextProps) => {
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.updatedAt === nextProps.task.updatedAt;
});
```

### Debounced Operations
```typescript
// Debounce storage writes for rapid updates
const debouncedSave = useMemo(
  () => debounce(async (task: Task) => {
    await storageClient.updateTask(task.id, task);
  }, 300),
  [storageClient]
);
```

### Lazy Loading
```typescript
// Code splitting for future features
const TaskAnalytics = lazy(() => import('./TaskAnalytics'));
const TaskExport = lazy(() => import('./TaskExport'));
```

## Error Boundary Strategy

### Component-Level Error Boundaries
```typescript
// TaskList Error Boundary
const TaskListErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      fallback={<TaskListErrorFallback />}
      onError={(error) => console.error('TaskList error:', error)}
    >
      {children}
    </ErrorBoundary>
  );
};

// Storage Error Boundary
const StorageErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      fallback={<StorageErrorFallback />}
      onError={(error) => {
        console.error('Storage error:', error);
        // Fallback to in-memory storage
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## Testing Architecture

### Component Testing Strategy
```typescript
// Test utilities for component testing
const renderWithProviders = (
  ui: React.ReactElement,
  { initialTasks = [], ...renderOptions } = {}
) => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <TodoProvider initialTasks={initialTasks}>
      {children}
    </TodoProvider>
  );
  
  return render(ui, { wrapper: TestWrapper, ...renderOptions });
};

// Component test patterns
describe('TaskItem', () => {
  test('toggles completion when checkbox clicked', async () => {
    const mockOnUpdate = jest.fn();
    const task = createMockTask({ completed: false });
    
    renderWithProviders(
      <TaskItem task={task} onUpdate={mockOnUpdate} onDelete={jest.fn()} />
    );
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(mockOnUpdate).toHaveBeenCalledWith({ completed: true });
  });
});
```

### Integration Testing
```typescript
// Full user flow testing
describe('Task Management Flow', () => {
  test('creates, edits, and deletes tasks', async () => {
    renderWithProviders(<App />);
    
    // Create task
    const input = screen.getByPlaceholderText('Add new task...');
    await user.type(input, 'Test task');
    await user.keyboard('{Enter}');
    
    expect(screen.getByText('Test task')).toBeInTheDocument();
    
    // Edit task
    await user.dblClick(screen.getByText('Test task'));
    const editInput = screen.getByDisplayValue('Test task');
    await user.clear(editInput);
    await user.type(editInput, 'Updated task');
    await user.keyboard('{Enter}');
    
    expect(screen.getByText('Updated task')).toBeInTheDocument();
    
    // Delete task
    const deleteButton = screen.getByLabelText('Delete task');
    await user.click(deleteButton);
    
    expect(screen.queryByText('Updated task')).not.toBeInTheDocument();
  });
});
```

## File Structure

```
src/
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   └── ErrorBoundary.tsx
│   ├── features/                    # Feature-specific components
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   ├── AddTaskForm.tsx
│   │   └── TaskStats.tsx
│   └── layout/                      # Layout components
│       ├── AppLayout.tsx
│       └── AppHeader.tsx
├── hooks/                           # Custom React hooks
│   ├── useTaskManager.ts
│   ├── useTaskForm.ts
│   ├── useTaskEdit.ts
│   └── useLocalStorage.ts
├── context/                         # React context providers
│   └── TodoContext.tsx
├── types/                           # TypeScript type definitions
│   ├── Task.ts
│   ├── Storage.ts
│   └── UI.ts
├── lib/                            # Utility libraries
│   ├── storage/
│   │   ├── StorageClient.ts
│   │   └── MockStorageClient.ts
│   └── utils/
│       ├── validation.ts
│       ├── formatting.ts
│       └── debounce.ts
└── __tests__/                      # Test files
    ├── components/
    ├── hooks/
    └── integration/
```

This component architecture provides a scalable, maintainable foundation for the Simple Todo application while demonstrating the subagent framework's ability to create well-structured applications with clear separation of concerns.
