# MyJantes - Design Guidelines

## Brand Identity
**Purpose**: MyJantes is a professional garage management platform connecting clients with automotive service providers for rim/wheel repairs and maintenance.

**Aesthetic Direction**: Professional-utilitarian with automotive precision. Clean, data-dense interfaces that prioritize efficiency and clarity. Red accent (#dc2626) provides urgency and action-orientation without overwhelming the professional context.

**Memorable Element**: Status-driven color coding across all documents (quotes, invoices, reservations) with contextual badges that make workflow state immediately visible.

## Navigation Architecture

**Client App** - Bottom Tab Navigation (5 tabs):
- Accueil (Home) - Dashboard overview
- Devis (Quotes) - Quote management
- Factures (Invoices) - Invoice tracking
- Réservations (Reservations) - Service bookings
- Profil (Profile) - Account settings

**Admin App** - Drawer + Bottom Tabs:
- Drawer contains: Analytics, Users, Services, Garages (superadmin only)
- Bottom tabs: Devis, Factures, Réservations, Notifications

**Authentication**: OAuth via WebBrowser for Replit OpenID Connect

## Screen Specifications

### Client: Accueil (Home)
- **Header**: Transparent, garage logo left, notifications bell right
- **Layout**: ScrollView with card-based summary sections
- **Components**: Stats cards (pending quotes count, unpaid invoices, upcoming reservations), quick action buttons
- **Insets**: top: headerHeight + 24px, bottom: tabBarHeight + 24px

### Client: Devis (Quotes List)
- **Header**: Default with title "Mes Devis", filter icon right
- **Layout**: FlatList with pull-to-refresh
- **Components**: Quote cards showing reference, vehicle info, amount, status badge, tap to expand
- **Empty State**: "Aucun devis" with empty-quotes.png illustration
- **Insets**: bottom: tabBarHeight + 24px

### Client: Devis Detail (Modal)
- **Header**: Custom with "Devis #REF", back button left, download PDF right
- **Layout**: ScrollView
- **Components**: Vehicle info section, itemized list, photos gallery, total amount prominent, accept/reject buttons at bottom
- **Insets**: standard modal insets

### Client: Factures (Invoices List)
- **Header**: Default with "Mes Factures", filter icon right
- **Layout**: FlatList with pull-to-refresh
- **Components**: Invoice cards with number, amount, due date, status badge, overdue indicator in red
- **Empty State**: "Aucune facture" with empty-invoices.png
- **Insets**: bottom: tabBarHeight + 24px

### Client: Réservations (Reservations)
- **Header**: Default with "Réservations", add button right (FAB alternative)
- **Layout**: FlatList with calendar integration at top
- **Components**: Reservation cards with service name, date/time, status, cancel option
- **Empty State**: "Aucune réservation" with empty-reservations.png
- **Insets**: bottom: tabBarHeight + 24px

### Client: Profil (Profile)
- **Header**: Transparent with "Profil"
- **Layout**: ScrollView with sectioned list
- **Components**: User info card at top, settings sections (notifications, theme toggle, language), logout button at bottom
- **Insets**: top: headerHeight + 24px, bottom: tabBarHeight + 24px

### Admin: Analytics Dashboard
- **Header**: Default with date range picker right
- **Layout**: ScrollView with dense data visualization
- **Components**: 
  - KPI cards row (CA Global, Pending, Avg Ticket, Conversion Rate)
  - Current month highlight card with growth indicator
  - Revenue chart (12-month line graph)
  - Payment method pie chart
  - Service revenue bar chart
  - Status stats grid
  - Export buttons (PDF, Excel)
- **Insets**: top: headerHeight + 16px, bottom: 16px

### Admin: Create/Edit Quote (Modal)
- **Header**: Custom with "Nouveau Devis"/"Modifier", cancel left, save right
- **Layout**: ScrollView with form sections
- **Components**: Client picker, service picker, vehicle info fields, items list with add/remove, photo upload, notes textarea
- **Insets**: standard modal insets

## Color Palette
- **Primary**: #dc2626 (Rouge MyJantes)
- **Primary Variant**: #b91c1c (darker red for pressed states)
- **Background Light**: #ffffff
- **Background Dark**: #0f0f0f
- **Surface Light**: #f9fafb
- **Surface Dark**: #1a1a1a
- **Text Primary Light**: #111827
- **Text Primary Dark**: #f9fafb
- **Text Secondary Light**: #6b7280
- **Text Secondary Dark**: #9ca3af
- **Border Light**: #e5e7eb
- **Border Dark**: #374151
- **Status Pending**: #f59e0b (orange)
- **Status Approved/Paid**: #10b981 (green)
- **Status Rejected/Cancelled**: #6b7280 (gray)
- **Status Overdue**: #dc2626 (red)

## Typography
- **Font Family**: System default (SF Pro iOS, Roboto Android)
- **Scale**:
  - Heading 1: 28px Bold
  - Heading 2: 22px Bold
  - Heading 3: 18px Semibold
  - Body: 16px Regular
  - Body Small: 14px Regular
  - Caption: 12px Regular
  - Button: 16px Semibold

## Visual Design
- **Icons**: Feather icons from @expo/vector-icons
- **Touchable Feedback**: 0.6 opacity on press, scale 0.98 for cards
- **Floating Buttons**: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- **Status Badges**: Rounded pill shape, 8px padding horizontal, uppercase 11px Semibold text
- **Cards**: 12px border radius, subtle border in light mode, elevated surface in dark mode
- **Skeleton Loaders**: Animated shimmer using Animated API

## Assets to Generate
1. **icon.png** - MyJantes logo with red/white rim graphic - App icon
2. **splash-icon.png** - Same as icon.png - Splash screen
3. **empty-quotes.png** - Clipboard with vehicle outline - Quotes empty state
4. **empty-invoices.png** - Document stack graphic - Invoices empty state
5. **empty-reservations.png** - Calendar with wrench icon - Reservations empty state
6. **garage-placeholder.png** - Generic garage logo - Admin garage list default
7. **avatar-placeholder.png** - User silhouette - User profiles without photo