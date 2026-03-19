# NEXUS PRO - Desktop Web Version

A comprehensive scheduling and business management system built as a desktop web application. Designed for service-based businesses like salons, barbershops, and clinics.

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Features](#features)
4. [Architecture](#architecture)
5. [API/Database Integration](#apidatabase-integration)
6. [Data Models & Storage](#data-models--storage)
7. [UI Components & Screens](#ui-components--screens)
8. [Key Functions](#key-functions)
9. [Third-Party Libraries](#third-party-libraries)
10. [Configuration Options](#configuration-options)
11. [Internationalization (i18n)](#internationalization-i18n)

---

## Overview

**NEXUS PRO** is a full-featured scheduling and business management web application featuring:

- Client appointment scheduling with multi-professional support
- Client management with history tracking
- Services and products catalog management
- Cashier/financial management (Caixa)
- Comprehensive statistics and analytics
- Backup/restore functionality
- Light/dark theme support
- Multi-language support (Portuguese/English)

---

## File Structure

```
NEXUS WEB 3/
├── index.html                       # Main HTML structure with all screens and modals
├── FRONTEND_STRUCTURE.md            # Frontend maintenance map
├── css/
│   ├── styles.css                   # CSS import manifest
│   ├── base/core.css                # Variables, reset, base layout
│   ├── layout/shell-calendar-clients.css
│   └── screens/
│       ├── modals-forms-services.css
│       ├── cashier.css
│       ├── ai-chat.css
│       └── responsive-overrides.css
├── js/
│   ├── app.js                       # Legacy compatibility loader
│   ├── legacy/app.monolith.js       # Snapshot of old single-file JS
│   └── modules/
│       ├── 00-core.js
│       ├── 10-init-auth-navigation.js
│       ├── 20-home-calendar-appointments.js
│       ├── 30-clients-stats.js
│       ├── 40-config-modals-services.js
│       ├── 50-backup-ai.js
│       ├── 60-cashier.js
│       └── 70-financial-and-final.js
└── google-sheets-backend/           # Apps Script backend reference files
```

---

## Features

### 1. Authentication & Multi-User Support
- Database URL connection via Google Apps Script
- Password-protected login per professional/admin
- "Quick Entry" visitor mode (read-only)
- Auto-login with saved credentials
- Admin vs Professional role differentiation

### 2. Dashboard Home Screen
- **Real-time Clock Widget** - Displays current time with date
- **Quick Stats** - Today's, tomorrow's, and weekly appointment counts
- **Today's Schedule Timeline** - Visual list of upcoming appointments
- **Week Summary Chart** - Bar chart showing appointment distribution
- **Birthday Widget** - Displays clients with birthdays today with WhatsApp integration
- **Quick Actions Grid** - Fast navigation to common tasks

### 3. Calendar/Agenda Screen
- **Grid-based Calendar View** - Time slots × Professionals matrix
- **Date Navigation** - Navigate by day/month/year with mini calendar
- **Professional Filtering** - Filter view by selected professional
- **Time Slot Actions**:
  - Create new appointment
  - Block time slots
  - View/edit existing appointments
- **Visual Indicators**:
  - Occupied slots (green)
  - Blocked slots (red/lock icon)
  - Lunch breaks (utensils icon)
  - Past time slots (dimmed)
  - Current time slot highlighting

### 4. Client Management
- **Client Cards Grid** - Visual card display with initials avatar
- **Search & Filter** - Search by name/phone/CPF, sort by name or recent
- **Client Details**:
  - Name, phone, CPF (Brazilian ID), birthday
  - Custom notes/observations
  - Appointment history count
  - VIP badge (10+ appointments)
- **CRUD Operations** - Create, read, update, delete clients
- **WhatsApp Integration** - Direct WhatsApp messaging link

### 5. Services Catalog
- **Service Cards** - Name, price, duration, custom icon, description
- **Icon Picker** - 200+ Font Awesome icons organized by category
- **Search Functionality**
- **CRUD Operations**

### 6. Products Inventory
- **Product Cards** - Name, price, stock level, custom icon, description
- **Stock Management** - Visual stock level indicators (OK/Low/Out)
- **Icon Picker** - Same comprehensive icon selection
- **Search & Filter**
- **CRUD Operations**

### 7. Cashier/Financial (Caixa)
- **Daily Transactions View** - Filter by date
- **Income/Expense Tracking**
- **Balance Calculation** - Real-time totals
- **Payment Methods** - Cash, PIX, Credit, Debit, Installment (Carnê)
- **Item Selection** - Link transactions to products/services
- **Stock Auto-Update** - Decrements product stock on sale
- **Transaction History** - Edit history tracking with timestamps
- **Breakdown Analysis** - Payment method distribution

### 8. Statistics
- **Period Selection** - Weekly or monthly view with navigation
- **KPI Cards**:
  - Total appointments
  - Total clients
  - Daily average
  - Peak day
- **Comparison Badges** - % change vs previous period
- **Charts**:
  - Bar/Line/Area chart for daily appointments
  - Services ring chart (donut/pie)
- **Peak Hours Grid** - Visual appointment distribution by hour
- **Top Professionals Ranking**
- **Summary Statistics**

### 9. Backup & Restore
- **Export** - Download complete backup as JSON
- **Import** - Restore from backup file
- **Data Preview** - Shows counts before import/export

### 10. Settings
- **Theme Toggle** - Dark/Light mode
- **Language Selector** - Portuguese/English
- **Professional Configuration**:
  - Lock/unlock schedule
  - Set lunch break times
- **Database URL Management**
- **Logout Functionality**

---

## Architecture

### Application State Management

The app uses a centralized state object `AppState`:

```javascript
const AppState = {
    connected: false,           // Database connection status
    loggedIn: false,            // User login status
    currentUser: null,          // Current user object {id, name, isAdmin}
    savedPassword: null,        // Cached password for auto-login
    dbUrl: '',                  // Google Apps Script URL
    agendadores: [],            // List of professionals
    appointments: [],           // All appointments
    clients: [],                // Client array
    knownClients: new Map(),    // Phone → client mapping
    deletedClients: new Set(),  // Deleted client phone keys
    clientNotes: {},            // Phone → notes mapping
    clientData: {},             // Phone → {cpf, birthday}
    horarios: null,             // Business hours config
    calendarDate: new Date(),   // Currently selected calendar date
    statsDate: new Date(),      // Stats period reference date
    refreshInterval: null,      // Auto-refresh timer
    pendingDeletions: new Set(), // IDs being deleted
    selectedProfessional: null, // Filter for calendar
    services: [],               // Local services catalog
    products: [],               // Local products inventory
    transactions: []            // Financial transactions
};
```

### Data Flow

1. **Initialization**: `DOMContentLoaded` → `loadConfig()` → `tryConnect()` → `loadAllData()`
2. **Auto-Refresh**: Every 10 seconds, `loadAllData()` fetches latest data
3. **Render Pipeline**: Data changes trigger `renderAll()` → individual render functions
4. **Persistence**: Local data saved via `saveConfig()` to localStorage

---

## API/Database Integration

### Database API (`DB` Object)

All requests go through a Google Apps Script web app:

```javascript
const DB = {
    _req(action, body)              // Base request method (POST with JSON)
    
    // Connection
    ping()                          // Test connection, returns {ok, agendadores, horarios}
    
    // Appointments (Agendamentos)
    list(filters)                   // List all appointments
    create(data)                    // Create appointment
    update(data)                    // Update appointment
    delete(id)                      // Delete appointment
    disponibilidade(date, agendadorId) // Get availability
    
    // Authentication
    auth(id, senha)                 // Authenticate user
    agendadores()                   // List professionals
    
    // Clients
    buscarCliente(termo)            // Search client
    cadastrarCliente(data)          // Register client
    atualizarCliente(data)          // Update client
    excluirCliente(id)              // Delete client
    listarClientes()                // List all clients
    
    // Professional Config
    getAgendadorConfig(agendadorId) // Get professional settings
    setAgendadorConfig(data)        // Update professional settings
    getAllConfigs()                 // Get all configurations
};
```

### Request Format

```javascript
fetch(AppState.dbUrl, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, ...body })
});
```

### Expected Backend Actions

| Action | Parameters | Description |
|--------|------------|-------------|
| `ping` | - | Connection test |
| `list` | filters | List appointments |
| `create` | date, time, client, phone, servico, observacoes, agendadorId, agendador, blocked | Create appointment |
| `update` | id, client, phone | Update appointment |
| `delete` | id | Delete appointment |
| `auth` | agendadorId, senha | User authentication |
| `agendadores` | - | List professionals |
| `disponibilidade` | date, agendadorId | Check availability |
| `buscarCliente` | termo | Search clients |
| `cadastrarCliente` | nome, telefone, cpf, aniversario | Register client |
| `atualizarCliente` | id, nome, telefone, cpf, aniversario | Update client |
| `excluirCliente` | id | Delete client |
| `listarClientes` | - | List all clients |
| `getAgendadorConfig` | agendadorId | Get pro config |
| `setAgendadorConfig` | agendadorId, bloqueado, almocoInicio, almocoFim | Update pro config |

---

## Data Models & Storage

### LocalStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `nexus_db_url` | string | Database connection URL |
| `nexus_credentials` | JSON | `{user, password}` for auto-login |
| `nexus_theme` | string | `'light'` or `'dark'` |
| `nexus_language` | string | `'pt'` or `'en'` |
| `nexus_client_notes` | JSON | `{phone: notes}` mapping |
| `nexus_client_data` | JSON | `{phone: {cpf, birthday}}` mapping |
| `nexus_deleted_clients` | JSON | Array of deleted client phone keys |
| `nexus_services` | JSON | Array of service objects |
| `nexus_products` | JSON | Array of product objects |
| `nexus_transactions` | JSON | Array of transaction objects |
| `nexus_birthday_message` | string | Custom birthday message template |

### Data Structures

#### Appointment
```javascript
{
    id: number,
    date: 'YYYY-MM-DD',
    time: 'HH:MM',
    client: string,
    phone: string,
    servico: string,           // Service name
    observacoes: string,       // Notes
    agendadorId: number,       // Professional ID
    agendador: string,         // Professional name
    blocked: boolean,          // Time block flag
    confirmado: boolean        // Confirmation status
}
```

#### Client
```javascript
{
    id: number,
    name: string,
    phone: string,
    cpf: string,
    birthday: 'YYYY-MM-DD',
    totalAgendamentos: number
}
```

#### Service
```javascript
{
    id: number,
    nome: string,
    preco: number,
    duracao: number,           // Minutes
    descricao: string,
    icon: string               // Font Awesome class
}
```

#### Product
```javascript
{
    id: number,
    nome: string,
    preco: number,
    estoque: number,           // Stock quantity
    descricao: string,
    icon: string               // Font Awesome class
}
```

#### Transaction
```javascript
{
    id: number,
    type: 'income' | 'expense',
    description: string,
    value: number,
    date: 'YYYY-MM-DD',
    paymentMethod: 'dinheiro' | 'pix' | 'credito' | 'debito' | 'carne',
    items: [{                  // Products/services sold
        type: 'product' | 'service',
        id: number,
        name: string,
        price: number,
        quantity: number,
        icon: string
    }],
    createdAt: ISO string,
    lastEditedAt: ISO string,
    editHistory: [{            // Edit tracking
        editedAt: ISO string,
        previousType: string,
        previousDescription: string,
        previousValue: number,
        previousDate: string,
        previousPaymentMethod: string,
        previousItems: array
    }]
}
```

#### Professional (Agendador)
```javascript
{
    id: number,
    nome: string,
    isAdmin: boolean,
    bloqueado: boolean,        // Schedule locked
    almocoInicio: 'HH:MM',     // Lunch start
    almocoFim: 'HH:MM'         // Lunch end
}
```

---

## UI Components & Screens

### HTML Structure (index.html)

```
body
├── #loading-screen          Loading animation with letter reveal
├── #login-screen            Database URL input + user selection
├── .app-container           Main application layout
│   ├── aside.sidebar        Navigation sidebar with mini calendar
│   └── main.main-content    Screen container
│       ├── #screen-home     Dashboard widgets
│       ├── #screen-calendar Time slot grid
│       ├── #screen-clients  Client card grid
│       ├── #screen-services Service catalog
│       ├── #screen-products Product inventory
│       ├── #screen-cashier  Financial management
│       ├── #screen-stats    Statistics & charts
│       ├── #screen-backup   Import/Export
│       └── #screen-settings Configuration
└── Modals
    ├── #modal-password      Login password entry
    ├── #modal-new-appointment  Create appointment
    ├── #modal-appointment-detail  View/edit appointment
    ├── #modal-confirm-cancel  Confirm deletion
    ├── #modal-client-detail   Edit client
    ├── #modal-new-client      Create client
    ├── #modal-date-picker     Calendar date selection
    └── #modal-birthday-config Birthday message setup
```

### CSS Architecture (styles.css)

#### CSS Variables (Theming)

```css
:root {
    /* Dark Theme (default) */
    --bg-main: #0a0a0a;
    --bg-sidebar: #0d0d0d;
    --bg-card: linear-gradient(...);
    --primary: #00ff88;           /* Bright green accent */
    --secondary: #4DABF7;         /* Blue */
    --danger: #ff4444;            /* Red */
    --warning: #ffa500;           /* Orange */
    --text-primary: #ffffff;
    --text-secondary: rgba(255,255,255,0.7);
    --text-muted: rgba(255,255,255,0.4);
    --border: rgba(255,255,255,0.06);
    --radius: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --sidebar-width: 260px;
}

body.light-mode {
    /* Light theme overrides */
    --bg-main: #f0f2f5;
    --primary: #00b85c;
    --text-primary: #1a1d21;
    /* ... */
}
```

#### Component Classes

| Class | Description |
|-------|-------------|
| `.screen` | Screen container (hidden by default) |
| `.screen.active` | Visible screen |
| `.widget-premium` | Dashboard widget card |
| `.nav-item` | Sidebar navigation button |
| `.btn-primary` | Primary action button (green) |
| `.btn-secondary` | Secondary action button |
| `.btn-danger` | Destructive action button |
| `.modal-overlay` | Modal backdrop |
| `.modal-content` | Modal dialog box |
| `.form-input` | Input field styling |
| `.calendar-grid-premium` | Calendar time slot grid |
| `.client-card` | Client card component |
| `.toast` | Notification toast |

---

## Key Functions

### Initialization

| Function | Description |
|----------|-------------|
| `loadConfig()` | Load settings from localStorage |
| `saveConfig()` | Persist settings to localStorage |
| `loadLanguage()` | Initialize i18n system |
| `initModals()` | Set up modal event handlers |
| `initNavigation()` | Set up sidebar navigation |
| `initDateSelectors()` | Initialize mini calendar |
| `initThemeToggle()` | Set up dark/light toggle |

### Authentication

| Function | Description |
|----------|-------------|
| `conectarDB()` | Connect to database URL |
| `tryConnect(url)` | Attempt connection and load data |
| `renderLoginUsers()` | Display user selection buttons |
| `selectUser(id, name)` | Open password modal |
| `submitLogin()` | Authenticate with backend |
| `quickLogin()` | Enter as viewer |
| `logout()` | Clear session and return to login |

### Data Management

| Function | Description |
|----------|-------------|
| `loadAllData()` | Fetch appointments and clients |
| `loadClientsFromBackend()` | Sync clients from backend |
| `extractClients()` | Build client list from appointments |
| `startAutoRefresh()` | Start 10-second refresh interval |
| `stopAutoRefresh()` | Stop refresh interval |

### Rendering

| Function | Description |
|----------|-------------|
| `renderAll()` | Refresh all UI components |
| `renderUpcoming()` | Update home screen appointments |
| `renderMiniSchedule()` | Update today's timeline |
| `renderBirthdays()` | Update birthday widget |
| `renderWeekSummary()` | Update week chart |
| `renderCalendar()` | Render calendar grid |
| `renderClients()` | Render client cards |
| `renderStats()` | Render statistics charts |
| `renderServices()` | Render services grid |
| `renderProducts()` | Render products grid |
| `renderCashier()` | Render cashier view |

### Appointments

| Function | Description |
|----------|-------------|
| `openNewAppointment(date, time, agId)` | Open creation modal |
| `saveNewAppointment()` | Create new appointment |
| `blockTimeSlot()` | Block a time slot |
| `showAppointmentDetail(id)` | View appointment details |
| `saveAppointmentChanges()` | Update appointment |
| `confirmDeleteAppointment()` | Show delete confirmation |
| `executeConfirmedDelete()` | Delete appointment |

### Clients

| Function | Description |
|----------|-------------|
| `openNewClient()` | Open client creation modal |
| `saveNewClient()` | Register new client |
| `openClientDetail(phone)` | View/edit client |
| `saveClientChanges()` | Update client |
| `deleteClient()` | Remove client |
| `searchClientSuggestions()` | Autocomplete client name |
| `openWhatsApp(phone)` | Open WhatsApp chat |
| `sendBirthdayMessage(phone, name)` | Send birthday greeting |

### Statistics

| Function | Description |
|----------|-------------|
| `setStatsPeriod(type)` | Switch week/month view |
| `navigateStatsPeriod(dir)` | Navigate periods |
| `getStatsPeriodRange()` | Calculate date range |
| `renderBarChart()` | Draw appointments chart |
| `renderServicesRing()` | Draw services donut chart |
| `renderPeakHours()` | Draw peak hours grid |
| `renderTopProfessionals()` | Draw rankings |
| `setChartType(type)` | Switch bar/line/area |

### Services & Products

| Function | Description |
|----------|-------------|
| `loadServicesFromStorage()` | Load from localStorage |
| `saveServicesToStorage()` | Persist to localStorage |
| `openServiceModal()` | Open service editor |
| `saveService()` | Save service |
| `deleteService()` | Remove service |
| `loadProductsFromStorage()` | Load products |
| `saveProductsToStorage()` | Save products |
| `openProductModal()` | Open product editor |
| `saveProduct()` | Save product |
| `deleteProduct()` | Remove product |
| `openIconPicker()` | Show icon selector |

### Cashier

| Function | Description |
|----------|-------------|
| `loadTransactionsFromStorage()` | Load transactions |
| `saveTransactionsToStorage()` | Persist transactions |
| `updateCashierTotals()` | Calculate totals |
| `renderTransactions()` | Display transaction list |
| `openTransactionModal()` | Open transaction editor |
| `saveTransaction()` | Save income/expense |
| `decreaseProductStock()` | Update stock on sale |
| `restoreProductStock()` | Undo stock change |

### Utilities

| Function | Description |
|----------|-------------|
| `formatDate(date)` | Format as 'YYYY-MM-DD' |
| `formatDateBR(str)` | Format as 'DD/MM/YYYY' |
| `formatBRL(val)` | Format as 'R$ X.XXX,XX' |
| `showToast(msg, type)` | Display notification |
| `openModal(id)` | Show modal |
| `closeModal(id)` | Hide modal |
| `t(key)` | Get translation |
| `updateClock()` | Update clock display |
| `switchScreen(id)` | Navigate to screen |

---

## Third-Party Libraries

### CDN Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| **Font Awesome** | 6.4.0 | Icons throughout UI |
| **Google Fonts - Montserrat** | Latest | Primary UI font (300-800 weights) |
| **Google Fonts - JetBrains Mono** | Latest | Monospace font for times/numbers |

### CDN URLs

```html
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### No JavaScript Dependencies

The application is built with **vanilla JavaScript** - no frameworks or libraries required.

---

## Configuration Options

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self' data: blob: https: wss: 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https:;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
    img-src 'self' data: blob: https:;
    font-src 'self' data: https:;
    connect-src *;
">
```

### Constants

```javascript
const REFRESH_INTERVAL_MS = 10000;  // Auto-refresh every 10 seconds

const RING_COLORS = [               // Chart colors
    '#00ff88', '#4DABF7', '#ffa500', '#ff4444',
    '#a855f7', '#ec4899', '#14b8a6', '#eab308'
];
```

### Business Hours Configuration

Received from backend in `horarios` object:

```javascript
{
    domingo: { abre: '00:00', fecha: '00:00' },  // Closed
    segunda: { abre: '08:00', fecha: '18:00' },
    terca: { abre: '08:00', fecha: '18:00' },
    quarta: { abre: '08:00', fecha: '18:00' },
    quinta: { abre: '08:00', fecha: '18:00' },
    sexta: { abre: '08:00', fecha: '18:00' },
    sabado: { abre: '08:00', fecha: '14:00' }
}
```

---

## Internationalization (i18n)

### Supported Languages

- **Portuguese (pt)** - Default
- **English (en)**

### Usage

```javascript
// Get translated string
t('save')  // Returns 'SALVAR' or 'SAVE'

// Get weekday names
getWeekdays()      // ['Domingo', 'Segunda', ...]
getWeekdaysShort() // ['DOM', 'SEG', ...]
getMonths()        // ['Janeiro', 'Fevereiro', ...]

// Set language
setLanguage('en')  // Updates UI and saves preference
```

### HTML Data Attributes

```html
<!-- Text content -->
<span data-i18n="save">SALVAR</span>

<!-- Placeholder -->
<input data-i18n-placeholder="search" placeholder="Buscar...">
```

### Adding Translations

Edit the `TRANSLATIONS` object in `app.js`:

```javascript
const TRANSLATIONS = {
    pt: {
        save: 'SALVAR',
        // ...
    },
    en: {
        save: 'SAVE',
        // ...
    }
};
```

---

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Requires:
- ES6+ JavaScript features
- CSS Custom Properties (Variables)
- CSS Grid & Flexbox
- Fetch API
- LocalStorage

---

## License

Proprietary - NEXUS PRO

---

*Documentation generated from codebase analysis - March 2026*
