# 📊 Analytics Charts Documentation

## Overview
The Analytics page features 10+ modern, colorful, and fully responsive charts and graphs.

## Chart Types Implemented

### 1. 📈 **Smooth Curved Line Chart**
- **Type:** Area chart with curved lines
- **Data:** Revenue & Purchase trends over time
- **Colors:** Blue (revenue) & Green (purchases)
- **Features:**
  - Smooth Bezier curves
  - Gradient area fills
  - Interactive data points
  - Grid lines for reference
  - Responsive SVG with preserveAspectRatio
  - Hover effects on data points

### 2. 📊 **Horizontal Bar Chart (Revenue Trend)**
- **Type:** Animated horizontal bars
- **Data:** Revenue by time period
- **Colors:** Gradient bars (blue, green, purple, orange, pink)
- **Features:**
  - Smooth width animations (duration: 700ms)
  - Shows sales count within bars
  - Responsive height (h-5 on mobile, h-6 on desktop)
  - Hover shadow effects
  - Shadow-inner background

### 3. 🍩 **Donut Chart (Revenue Distribution)**
- **Type:** Segmented donut chart
- **Data:** Revenue by offer type
- **Colors:** Blue, Orange, Purple, Green
- **Features:**
  - SVG-based circular segments
  - Center displays total revenue
  - Drop shadow filter
  - Responsive sizing (w-40 to w-56)
  - Interactive legend with percentages
  - Smooth animations (duration: 1000ms)

### 4. 🥧 **Pie Chart (Category Performance)**
- **Type:** Full pie chart with center hole
- **Data:** Sales by category
- **Colors:** Blue, Green, Purple, Orange
- **Features:**
  - SVG path-based slices
  - Calculated angles for each segment
  - Center circle cutout
  - Hover opacity effects
  - Responsive sizing
  - Detailed legend

### 5. 🎯 **Circular Progress Charts**
- **Type:** Radial progress indicators (4 charts)
- **Data:** Conversion rates by offer type
- **Colors:** Blue, Green, Purple, Orange
- **Features:**
  - SVG stroke-based circles
  - Smooth progress animations
  - Hover scale effect (110%)
  - Glow shadows on hover
  - Responsive sizing
  - Displays sales count

### 6. 🏅 **Top Performers with Medals**
- **Type:** Ranked list with medal badges
- **Data:** Top 3 offers by revenue
- **Colors:** Gold, Silver, Bronze gradients
- **Features:**
  - Gradient medal backgrounds
  - Color-coded borders (yellow, gray, orange)
  - Hover scale effect
  - Shows views, purchases, revenue
  - Responsive layout (column on mobile)

### 7. 🔥 **Weekly Activity Heatmap**
- **Type:** Grid heatmap (7 days × 24 hours)
- **Data:** Hourly activity throughout the week
- **Colors:** 7 different colors per day
- **Features:**
  - Opacity represents activity intensity
  - Hover tooltips showing hour
  - Horizontal scroll on mobile (min-w-600px)
  - Legend showing activity levels
  - Responsive sizing

### 8. 🎯 **Radial Progress - Monthly Goals**
- **Type:** Circular goal trackers (4 goals)
- **Data:** Progress towards monthly targets
- **Colors:** Blue, Green, Purple, Orange
- **Features:**
  - Percentage completion
  - Current/Target values displayed
  - Smooth stroke animation
  - Responsive grid (2 cols mobile, 4 cols desktop)
  - Rounded stroke caps

### 9. 🔻 **Sales Funnel Chart**
- **Type:** Funnel visualization
- **Data:** Conversion stages (Views → Purchase)
- **Colors:** Blue → Green → Purple → Orange
- **Features:**
  - 4-stage funnel
  - Numbered badges
  - Progress bars with smooth animation
  - Shows count and percentage
  - Stage-by-stage drop-off visualization

### 10. 📊 **Performance by Offer Type**
- **Type:** Stacked metrics with progress bars
- **Data:** Views, Purchases, Conversion per type
- **Colors:** Border-left accent (blue, green, purple, orange)
- **Features:**
  - 3-metric mini cards
  - Revenue progress bar
  - Color-coded borders
  - Shadow effects on hover
  - Fully responsive

### 11. 💡 **Key Insights Cards**
- **Type:** Info cards with colored backgrounds
- **Data:** AI-generated insights
- **Colors:** Green, Blue, Yellow, Purple backgrounds
- **Features:**
  - Icon indicators
  - Colored borders and backgrounds
  - Hover brightness effect
  - Responsive text sizing
  - 2-column layout on desktop

## Responsive Design

### Breakpoints Used:
- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (sm - lg)
- **Desktop:** > 1024px (lg+)

### Responsive Features:
- ✅ All charts scale smoothly
- ✅ Text sizes adapt (text-xs to text-base)
- ✅ Grid layouts adjust (1 col → 2 col → 4 col)
- ✅ Padding responsive (p-4 → p-6)
- ✅ Chart dimensions responsive (w-40 → w-56)
- ✅ Horizontal scroll on heatmap for mobile
- ✅ Column layouts on mobile for lists

## Color Palette

### Primary Colors:
- **Blue:** `rgb(59, 130, 246)` - Active Offers
- **Green:** `rgb(34, 197, 94)` - Weekday Specials
- **Purple:** `rgb(168, 85, 247)` - Happy Hour
- **Orange:** `rgb(249, 115, 22)` - Gift Cards
- **Pink:** `rgb(236, 72, 153)` - Special Events
- **Yellow:** `#FFEE00` - Primary brand color

### Gradients:
- Revenue bars use `from-{color}-500 to-{color}-600`
- Medals use `from-{color}-400 to-{color}-600`
- Area charts use gradient with opacity fade

## Animation Timings

- **Bar widths:** 500-700ms
- **Circle progress:** 1000ms
- **Hover effects:** 200-300ms
- **Scale transforms:** default transition
- **Opacity changes:** 300ms

## Interactive Features

- ✅ Hover tooltips on heatmap cells
- ✅ Hover scale on medal cards
- ✅ Hover opacity on pie slices
- ✅ Hover shadow enhancement on bars
- ✅ Conversion rate badge on hover (line chart)
- ✅ Scale animation on circular progress

## Accessibility

- All text maintains good contrast ratios
- Icons have semantic meaning
- Colors are not the only differentiator (also uses text/numbers)
- Responsive touch targets (min 44x44px)
- Keyboard navigation support on interactive elements

## Performance

- SVG for scalable graphics (no pixelation)
- CSS transitions for smooth animations
- No external chart libraries needed
- Lightweight and fast rendering
- Optimized for mobile devices


