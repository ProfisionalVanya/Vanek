import { createContext, useContext, useState, useMemo } from 'react';

const texts = {
  ru: {
    title: 'Менеджер задач',
    search: 'Поиск (нажмите /)',
    all: 'Все',
    active: 'Активные',
    done: 'Готовые',
    total: 'Всего',
    doneLabel: 'выполнено',
  },
  en: {
    title: 'Task manager',
    search: 'Search (press /)',
    all: 'All',
    active: 'Active',
    done: 'Done',
    total: 'Total',
    doneLabel: 'done',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru');
  const value = useMemo(() => ({ lang, setLang, tr: texts[lang] }), [lang]);
  return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage нужно вызывать внутри LanguageProvider');
  return ctx;
}
