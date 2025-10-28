# Stop de Ontkoking - Frontend

Een modern digitaal kookplatform gebouwd met Next.js waar gebruikers recepten kunnen delen, ontdekken en beheren.

## 🚀 Features

### Gebruikersfunctionaliteiten
- ✅ **Receptbeheer**: Recepten aanmaken, bewerken en verwijderen
- 🔍 **Zoeken & Filteren**: Op ingrediënten en type gerecht (ontbijt, lunch, diner, voorgerecht, hoofdgerecht, nagerecht)
- 🔐 **Authenticatie**: Login, signup en profielbeheer
- 📖 **Receptdetails**: Volledige weergave met ingrediënten, bereidingswijze en tips
- 👤 **Profielpagina**: Overzicht van eigen recepten

### Adminfunctionaliteiten
- 👥 **Gebruikersbeheer**: Gebruikers bekijken en verwijderen
- 📝 **Receptenbeheer**: Alle recepten bekijken, bewerken en verwijderen
- 📊 **Dashboard**: Statistieken en overzicht

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **TypeScript**: Voor type safety

## 📦 Installatie

```bash
# Installeer dependencies
npm install

# Kopieer environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

De applicatie draait op [http://localhost:3000](http://localhost:3000)

## 🎨 UI/UX Design

- **Modern & Clean**: Frisse interface speciaal voor Gen Z
- **Responsive**: Volledig responsive voor mobiel, tablet en desktop
- **Dark Mode**: Ondersteuning voor licht en donker thema
- **Toegankelijk**: WCAG compliant met keyboard navigatie
- **Loading States**: Skeleton loaders voor betere UX
- **Empty States**: Duidelijke feedback wanneer geen data beschikbaar is
- **Toast Notificaties**: Feedback bij acties

## 📁 Project Structuur

```
src/
├── app/                    # Next.js App Router pagina's
│   ├── admin/             # Admin dashboard
│   ├── login/             # Login pagina
│   ├── signup/            # Registratie pagina
│   ├── profiel/           # Profielpagina
│   ├── recepten/          # Recepten overzicht en detail
│   │   ├── [id]/         # Recept detail & bewerken
│   │   └── nieuw/        # Nieuw recept
│   └── api/              # Backend API routes (bestaand)
├── components/            # React componenten
│   ├── ui/               # shadcn/ui basis componenten
│   ├── navbar.tsx        # Navigatiebalk
│   ├── footer.tsx        # Footer
│   ├── recipe-card.tsx   # Recept kaart component
│   ├── recipe-form.tsx   # Recept formulier
│   ├── search-bar.tsx    # Zoekbalk met filters
│   └── ...
├── lib/                  # Utility functies
│   ├── api.ts           # API client functies
│   ├── auth-context.tsx # Auth context provider
│   ├── utils.ts         # Helper functies
│   └── ...
├── types/               # TypeScript type definities
│   ├── recipe.ts
│   └── user.ts
└── hooks/              # Custom React hooks
    └── use-toast.ts
```

## 🔐 Authenticatie

De applicatie gebruikt JWT tokens voor authenticatie:
- Access tokens voor API requests
- Refresh tokens voor sessie verlenging
- HTTP-only cookies voor veilige opslag

## 🎯 Belangrijke Pagina's

### Publiek Toegankelijk
- `/` - Homepage/Landingspagina
- `/recepten` - Recepten overzicht
- `/recepten/[id]` - Recept detail
- `/login` - Inloggen
- `/signup` - Registreren

### Gebruiker (Ingelogd)
- `/profiel` - Profielpagina
- `/recepten/nieuw` - Nieuw recept toevoegen
- `/recepten/[id]/bewerken` - Recept bewerken

### Admin
- `/admin` - Admin dashboard

## 🎨 Theming

De applicatie ondersteunt licht en donker thema. Het thema wordt opgeslagen in localStorage en automatisch toegepast.

Kleuren zijn gedefinieerd in `src/app/globals.css` met CSS variabelen voor eenvoudige aanpassing.

## 📝 Formulieren & Validatie

Alle formulieren gebruiken:
- **react-hook-form** voor formulierbeheer
- **zod** voor schema validatie
- Real-time validatie met duidelijke foutmeldingen
- Disabled state tijdens submit

## 🔄 State Management

- **Auth State**: React Context (`AuthProvider`)
- **Toast Notifications**: Custom hook (`useToast`)
- **Form State**: react-hook-form
- **Server State**: Direct API calls (geen caching library)

## 🚦 Route Guards

- Login/Signup pagina's redirecten naar `/recepten` als al ingelogd
- Protected routes redirecten naar `/login` als niet ingelogd
- Admin routes controleren op admin rol

## 📱 Responsive Design

- **Mobile First**: Ontworpen voor mobiele apparaten
- **Breakpoints**: 
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Mobile Menu**: Hamburger menu voor kleine schermen

## 🎭 Componenten Overzicht

### UI Components (shadcn/ui)
- Button, Input, Label, Textarea
- Card, Badge, Avatar, Separator
- Dialog, DropdownMenu, Select
- Toast, Skeleton

### Custom Components
- **Navbar**: Hoofdnavigatie met user menu
- **Footer**: Footer met links
- **RecipeCard**: Recept preview kaart
- **RecipeForm**: Formulier voor recepten
- **SearchBar**: Zoekbalk met filters
- **EmptyState**: Lege state component
- **LoadingSkeletons**: Loading skeletons

## 🐛 Error Handling

- API errors worden opgevangen en getoond via toast notifications
- Formulier validatie errors worden inline getoond
- Loading states voorkomen dubbele submissions
- 404 states voor niet-gevonden resources

## 🔧 Development

```bash
# Development server met hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🚀 Deployment

De applicatie kan gedeployed worden naar:
- **Vercel** (aanbevolen voor Next.js)
- **Netlify**
- **Docker** (met dockerfile)
- Elke Node.js hosting service

Zorg ervoor dat environment variables correct zijn ingesteld in je deployment platform.

## 📄 License

Dit project is gebouwd als onderdeel van Stop de Ontkoking.

---

Gemaakt met ❤️ voor kookliefhebbers
