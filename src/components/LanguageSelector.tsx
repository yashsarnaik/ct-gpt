import React, { useRef, useState } from 'react';
import { Languages } from 'lucide-react';
import { languages } from '../utils/languages';
import { useClickOutside } from '../hooks/useClickOutside';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  const currentLanguageInfo = languages.find(l => l.code === currentLanguage);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Languages className="w-5 h-5" />
        <span className="text-lg">{currentLanguageInfo?.flag}</span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 transform opacity-100 scale-100 transition-all duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-200 ${
                currentLanguage === language.code ? 'bg-gray-50 font-medium' : ''
              }`}
              role="menuitem"
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}