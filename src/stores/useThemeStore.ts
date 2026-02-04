import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Appearance } from 'react-native';
import { ThemeMode, ThemeColors, lightColors, darkColors } from '../utils/theme';
import StorageService from '../services/StorageService';
import { STORAGE_KEYS } from '../api/config';

interface ThemeState {
    mode: ThemeMode;
    colors: ThemeColors;
    isDark: boolean;
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

// Custom storage adapter using the existing StorageService (MMKV)
const storage = {
    getItem: (name: string) => {
        const value = StorageService.getString(name);
        return value ? Promise.resolve(value) : null;
    },
    setItem: (name: string, value: string) => {
        StorageService.setString(name, value);
        return Promise.resolve();
    },
    removeItem: (name: string) => {
        StorageService.remove(name);
        return Promise.resolve();
    },
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            mode: 'system',
            // Initial state will be overwritten by hydration, but we set safe defaults
            isDark: Appearance.getColorScheme() === 'dark',
            colors: Appearance.getColorScheme() === 'dark' ? darkColors : lightColors,

            setTheme: (mode: ThemeMode) => {
                const systemScheme = Appearance.getColorScheme();
                const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

                set({
                    mode,
                    isDark,
                    colors: isDark ? darkColors : lightColors,
                });
            },

            toggleTheme: () => {
                const { mode } = get();
                const systemScheme = Appearance.getColorScheme();
                const currentIsDark = mode === 'system'
                    ? systemScheme === 'dark'
                    : mode === 'dark';

                const newMode = currentIsDark ? 'light' : 'dark';

                set({
                    mode: newMode,
                    isDark: !currentIsDark,
                    colors: !currentIsDark ? darkColors : lightColors,
                });
            },
        }),
        {
            name: STORAGE_KEYS.THEME, // Key in storage
            storage: createJSONStorage(() => storage),
            onRehydrateStorage: () => (state) => {
                // Determine correct colors after hydration if mode is 'system'
                if (state && state.mode === 'system') {
                    const systemScheme = Appearance.getColorScheme();
                    state.isDark = systemScheme === 'dark';
                    state.colors = systemScheme === 'dark' ? darkColors : lightColors;
                }
            },
        }
    )
);
