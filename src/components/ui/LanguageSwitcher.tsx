import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'is', name: 'Íslenska', flag: '🇮🇸' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-primary hover:bg-primary/10 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
          <Globe className="text-primary transition-transform duration-200 group-hover:rotate-12" size={18} />
          <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary rounded text-xs font-semibold uppercase transition-all duration-200">
            {currentLanguage.code}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="w-48 bg-card-background border-primary shadow-lg"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-md transition-all duration-200 ${
              i18n.language === language.code 
                ? 'bg-primary/20 text-white' 
                : 'text-gray-300 hover:bg-primary/10 hover:text-white'
            }`}
          >
            <span className="text-lg transition-transform duration-200 hover:scale-110">
              {language.flag}
            </span>
            <span className="flex-1 font-medium">{language.name}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase transition-all duration-200 ${
              i18n.language === language.code 
                ? 'bg-primary text-dark border border-primary' 
                : 'bg-primary/20 text-primary border border-primary/50'
            }`}>
              {language.code}
            </span>
            {i18n.language === language.code && (
              <span className="text-primary ml-1 animate-in fade-in duration-200">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

