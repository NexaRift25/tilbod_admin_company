# Internationalization (i18n) Setup

This project uses `react-i18next` for internationalization support.

## Available Languages

- **English (en)** - Default language
- **Icelandic (is)** - Secondary language

## Usage

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t("common.appName")}</h1>;
}
```

### Translation with Variables

```tsx
const { t } = useTranslation();

// In translation file: "daysLeft": "{{days}} days left"
t("offerDetails.daysLeft", { days: 5 })
```

### Language Switcher Component

Add the language switcher to your layout:

```tsx
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

<LanguageSwitcher />
```

## Adding New Translations

1. Add the translation key to both `src/i18n/locales/en.json` and `src/i18n/locales/is.json`
2. Use the key in your component with `t("namespace.key")`

## Translation File Structure

```
src/i18n/
├── config.ts           # i18n configuration
├── locales/
│   ├── en.json         # English translations
│   └── is.json         # Icelandic translations
└── README.md           # This file
```

## Namespaces

- `common` - Common UI elements (buttons, labels, etc.)
- `offerDetails` - Offer details page translations
- `status` - Status labels
- `offerTypes` - Offer type labels
- `weekdays` - Day names

## Language Detection

The app automatically detects the user's language preference from:
1. LocalStorage (saved preference)
2. Browser language settings

The selected language is saved to localStorage for persistence.

