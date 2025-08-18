# Skeleton Loading Components

This directory contains skeleton loading components that provide visual feedback during data loading states throughout the ATS Checker application. All skeletons follow the dark theme color scheme.

## Dark Theme Color Palette

The skeleton components use the following color scheme:
- `#000000` - Primary background
- `#0A0A0A` - Secondary background  
- `#171717` - Card backgrounds, skeleton shapes
- `#262626` - Borders, secondary skeleton shapes
- `#373737` - Interactive elements
- `#525252` - Dividers
- `#404040` - Button states
- `#737373` - Secondary text
- `#A3A3A3` - Primary text

## Available Skeleton Components

### Page-Level Skeletons
- **`DashboardSkeleton`** - Full dashboard page skeleton with stats cards, charts, and recent reports
- **`UploadFormSkeleton`** - Upload form page with file upload areas and progress steps
- **`ResultsPageSkeleton`** - Results page with score cards, suggestions, and skills analysis
- **`AuthPageSkeleton`** - Authentication page with form fields and social login
- **`HomePageSkeleton`** - Landing page with hero section, features, and CTAs

### Component-Level Skeletons
- **`NavbarSkeleton`** - Navigation bar with logo, menu items, and user menu
- **`FileUploadSkeleton`** - File upload area with drag-and-drop zone
- **`AnalyzingStateSkeleton`** - Analysis progress with dynamic progress bar and status text
- **`CardSkeleton`** - Generic card skeleton with configurable content lines
- **`TableSkeleton`** - Data table skeleton with rows and columns
- **`ListSkeleton`** - List items with avatars and metadata
- **`AppLoadingSkeleton`** - Universal loading screen with customizable icons and messages

### Dashboard-Specific Skeletons
- **`RecentReportsSkeleton`** - Recent reports card with multiple report items
- **`AnalyticsOverviewSkeleton`** - Analytics chart area with legend
- **`StatsCardsSkeleton`** - Statistics cards grid with animated loading

## Usage Examples

### Basic Page Skeleton
```jsx
import { DashboardSkeleton } from '../components/skeletons';

const DashboardPage = () => {
  const { loading } = useData();
  
  if (loading) {
    return <DashboardSkeleton />;
  }
  
  return <ActualDashboard />;
};
```

### Component Skeleton with Props
```jsx
import { CardSkeleton } from '../components/skeletons';

<CardSkeleton 
  showHeader={true}
  contentLines={4}
  className="mb-4"
/>
```

### Dynamic Loading State
```jsx
import { AppLoadingSkeleton } from '../components/skeletons';

<AppLoadingSkeleton 
  type="analysis"
  message="Analyzing your resume..."
  showIcon={true}
/>
```

## Animation Features

All skeleton components include:
- **Staggered animations** - Child elements animate in sequence
- **Pulse effects** - Simulated loading with opacity changes
- **Motion transitions** - Smooth entry/exit animations using Framer Motion
- **Progressive loading** - Some skeletons show progressive states (e.g., AnalyzingStateSkeleton)

## Customization

### Color Theming
All components use CSS classes that can be easily customized:
```jsx
className="bg-[#171717] animate-pulse"
```

### Animation Timing
Modify animation delays and durations:
```jsx
transition={{ delay: i * 0.1, duration: 0.3 }}
```

### Content Configuration
Many skeletons accept props for customization:
```jsx
<TableSkeleton rows={5} columns={4} showHeader={true} />
<ListSkeleton items={3} showAvatar={true} />
```

## Best Practices

1. **Match Content Structure** - Skeleton should mirror the actual component layout
2. **Appropriate Timing** - Show skeletons for loading states > 200ms
3. **Smooth Transitions** - Use consistent animation timing across components
4. **Accessibility** - Include appropriate ARIA labels for screen readers
5. **Performance** - Use simple shapes and avoid complex animations

## Implementation Notes

- All skeletons use Framer Motion for animations
- Color values are hardcoded for consistency
- Components are optimized for React 18+ concurrent features
- Skeleton shapes use rounded corners consistent with the design system
- Animation performance is optimized with `transform` and `opacity` properties

## Integration Points

The skeleton system integrates with:
- **Auth Store** - Loading states during authentication
- **ATS Store** - Analysis progress and data loading
- **Router** - Page transition loading states
- **API Layer** - Network request loading states

This skeleton system provides a comprehensive loading experience that maintains user engagement and provides clear feedback about application state across all user interactions.
