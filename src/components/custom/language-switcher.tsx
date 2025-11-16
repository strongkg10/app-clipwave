'use client';

import React from 'react';
import { useLocale } from '@/lib/locale-context';
import { locales, localeNames, localeFlags, Locale } from '@/lib/i18n';
import { Globe, Check } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">{localeFlags[locale]} {localeNames[locale]}</span>
        <span className="sm:hidden text-sm">{localeFlags[locale]}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-purple-500/20 rounded-xl shadow-2xl z-50">
            <div className="p-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    locale === loc
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{localeFlags[loc]}</span>
                    <span className="text-sm">{localeNames[loc]}</span>
                  </span>
                  {locale === loc && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
