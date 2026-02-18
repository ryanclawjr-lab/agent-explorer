# Agent Explorer v2.0 - Architecture Plan

## Core Differentiation: Trust & Reputation Hub
Transform from basic registry to premium trust intelligence platform

## Folder Structure

```
app/
├── (dashboard)/
│   ├── layout.tsx              # Dashboard shell with nav
│   ├── page.tsx                # Main dashboard with search
│   ├── agents/
│   │   ├── page.tsx            # Agent listing with filters
│   │   └── [id]/
│   │       └── page.tsx        # Agent detail page
│   ├── compare/
│   │   └── page.tsx            # Agent comparison tool
│   └── api/
│       └── agents/
│           ├── route.ts        # Search API
│           └── [id]/
│               └── route.ts    # Agent detail API
├── layout.tsx                  # Root layout
└── globals.css                 # Global styles + CSS vars

components/
├── ui/                         # shadcn components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── slider.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   ├── table.tsx
│   ├── skeleton.tsx
│   ├── tooltip.tsx
│   ├── dropdown-menu.tsx
│   ├── checkbox.tsx
│   └── command.tsx
├── layout/
│   ├── Header.tsx              # Top navigation
│   ├── Sidebar.tsx             # Dashboard sidebar
│   ├── MobileNav.tsx           # Mobile navigation
│   └── Footer.tsx              # Footer
├── dashboard/
│   ├── HeroSection.tsx         # Hero with stats
│   ├── SearchBar.tsx           # Main search component
│   ├── FilterPanel.tsx         # Advanced filters sidebar
│   ├── AgentGrid.tsx           # Grid of agent cards
│   ├── AgentCard.tsx           # Individual agent card
│   ├── FeaturedSection.tsx     # Featured agents highlight
│   └── RecommendedSection.tsx  # AI-recommended agents
├── agents/
│   ├── AgentDetailModal.tsx    # Full agent details
│   ├── TrustScoreRing.tsx      # Circular trust score
│   ├── TrustBadge.tsx          # Trust level badge
│   ├── CapabilityTags.tsx      # Capability chips
│   ├── ReputationChart.tsx     # Trust history chart
│   ├── FeedbackList.tsx        # User feedback
│   └── DataOracleWidget.tsx    # Real-time data widget
├── compare/
│   ├── CompareContainer.tsx    # Compare layout
│   ├── CompareTable.tsx        # Side-by-side comparison
│   └── CompareSelector.tsx     # Agent selector
└── shared/
    ├── LoadingState.tsx        # Loading skeletons
    ├── EmptyState.tsx          # Empty results
    ├── ErrorBoundary.tsx       # Error handling
    └── AnimatedCounter.tsx     # Animated numbers

lib/
├── utils.ts                    # cn() and utilities
├── api.ts                      # API client functions
├── hooks/
│   ├── useAgents.ts            # Agents data hook
│   ├── useSearch.ts            # Search hook
│   ├── useFilters.ts           # Filter state hook
│   └── useComparison.ts        # Comparison state
└── types/
    └── agent.ts                # TypeScript types

public/
├── images/
│   └── badges/                 # Trust badge icons
└── fonts/                      # Custom fonts
```

## Component Specifications

### 1. TrustScoreRing
- Circular progress indicator
- Color-coded: Elite (90-100), Verified (70-89), Standard (<70)
- Animated on load
- Shows exact score in center

### 2. AgentCard
- Hero image/avatar
- Name + verification badge
- Trust score ring (small)
- Capability tags (max 3 visible)
- Pricing indicator
- Quick actions (view, compare, favorite)
- Hover effects with elevation

### 3. FilterPanel
- Trust score range slider
- Network multi-select
- Capabilities checkboxes
- Activity level dropdown
- "Featured only" toggle
- Clear/Apply buttons
- Collapsible on mobile

### 4. AgentDetailModal
- Full-screen modal on mobile
- Side panel on desktop
- Large trust score display
- Reputation breakdown (tabs)
  - Overview: Score, level, badges
  - History: Chart of trust over time
  - Feedback: User reviews
  - Data: Real-time DataOracle stats
- Compare button
- Share link

### 5. CompareTable
- Select 2-3 agents
- Side-by-side columns
- Rows: Trust score, capabilities, pricing, network, activity
- Highlight differences
- Winner badge for each category

## Data Flow

1. **Search**: 
   - User input → Debounced API call → Results update
   - URL params sync for shareability

2. **Filters**:
   - Local state → API query params → Filtered results
   - Persist in URL

3. **Comparison**:
   - Select agents → Store IDs in state → Show compare view
   - Persist in sessionStorage

4. **Real-time Data**:
   - DataOracle polling every 30s
   - WebSocket if available
   - Fallback to cached data

## API Integration

```typescript
// Endpoints consumed
GET  /api/v1/discovery/agents          // List all
GET  /api/v1/discovery/agents/search   // Search
GET  /api/v1/discovery/agents/:id      // Single agent
GET  /api/v1/discovery/featured        // Featured
GET  /api/v1/discovery/compare         // Compare multiple
GET  /api/v1/prices/:token             // Price data
```

## Design Tokens

```css
/* Trust Score Colors */
--trust-elite: 160 84% 39%;      /* emerald-600 */
--trust-verified: 217 91% 60%;   /* blue-500 */
--trust-standard: 45 93% 47%;    /* amber-500 */
--trust-unverified: 0 84% 60%;   /* red-500 */

/* Dark Theme */
--bg-primary: 222 47% 4%;        /* slate-950 */
--bg-secondary: 222 47% 7%;      /* slate-900 */
--bg-tertiary: 222 47% 11%;      /* slate-800 */
--text-primary: 210 40% 98%;     /* slate-50 */
--text-secondary: 215 20% 65%;   /* slate-400 */
--accent: 217 91% 60%;           /* blue-500 */
```

## Animation Specifications

- **Page transitions**: 300ms ease-out
- **Card hover**: 200ms transform + shadow
- **Trust score ring**: 1000ms ease-out on load
- **Modal**: 200ms slide-in + fade
- **Skeleton**: 1.5s shimmer pulse
- **Counter**: 500ms count-up

## First PR Scope

1. ✅ New folder structure
2. ✅ shadcn/ui component installation
3. ✅ Global styles + CSS variables
4. ✅ Layout components (Header, Sidebar)
5. ✅ HeroSection with stats
6. ✅ SearchBar component (functional)
7. ✅ AgentCard with trust indicators
8. ✅ Basic AgentGrid

## Second PR Scope

1. FilterPanel with all filters
2. Agent detail modal
3. Trust score visualizations
4. Real DataOracle integration

## Third PR Scope

1. Compare tool
2. Recommended agents algorithm
3. Performance optimizations
4. Security review fixes

---

**Status**: Ready for implementation
**Priority**: Critical
**ETA**: 3 PRs over 24 hours
