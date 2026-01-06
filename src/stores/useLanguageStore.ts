import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Dictionary } from '../types/i18n';
import { en } from '../i18n/en';
import { zh } from '../i18n/zh';

type Language = 'en' | 'zh';

interface LanguageState {
    currentLang: Language;
    t: Dictionary; // Expose current dictionary directly for easy access
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            currentLang: 'zh', // Default to Chinese
            t: zh,
            setLanguage: (lang) => set({
                currentLang: lang,
                t: lang === 'en' ? en : zh
            }),
        }),
        {
            name: 'aus-sim-lang',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
