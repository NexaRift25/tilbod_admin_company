# Tilbod Company Website

A modern, multi-theme React application built with Vite, TypeScript, and shadcn/ui.

## Features

- ⚡️ **Vite** - Lightning-fast HMR and build tool
- ⚛️ **React 18** - Latest React features
- 🎨 **shadcn/ui** - Beautiful, accessible components
- 🎭 **Multi-Theme Support** - Light/Dark mode + 4 color themes (Blue, Green, Purple, Orange)
- 🎯 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧭 **React Router** - Client-side routing
- 📱 **Responsive Design** - Mobile-first approach

## Theme System

The application includes a sophisticated multi-theme system:

### Mode Themes
- **Light Mode** - Clean, bright interface
- **Dark Mode** - Easy on the eyes

### Color Themes (available in Light mode)
- **Default** - Classic blue theme
- **Blue** - Professional blue
- **Green** - Nature-inspired green
- **Purple** - Creative purple
- **Orange** - Energetic orange

All themes use CSS variables for colors, ensuring consistency and easy customization.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
tilbod-company/
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── contexts/        # React contexts
│   │   └── ThemeContext.tsx
│   ├── lib/             # Utilities
│   │   └── utils.ts
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   └── Contact.tsx
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles & themes
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Adding New Color Themes

1. Add theme CSS variables in `src/index.css`:
```css
.theme-yourtheme {
  --primary: YOUR_HSL_VALUE;
  --primary-foreground: YOUR_HSL_VALUE;
  /* ... other variables */
}
```

2. Update the theme list in `src/components/ThemeSwitcher.tsx`

### Modifying Existing Themes

Edit the CSS variables in `src/index.css` under the respective theme class.

## Technologies

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Router](https://reactrouter.com/)

## License

MIT

## Author

Tilbod Company

