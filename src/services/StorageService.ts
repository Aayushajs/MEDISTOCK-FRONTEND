import { createMMKV, MMKV } from 'react-native-mmkv';

// Initialize MMKV storage
export const storage = createMMKV({ id: 'medistore-storage' });

// ============================================
// Storage Service - Wrapper functions
// ============================================

export const StorageService = {
    // String operations
    setString: (key: string, value: string): void => {
        storage.set(key, value);
    },
    getString: (key: string): string | undefined => {
        return storage.getString(key);
    },

    // Number operations
    setNumber: (key: string, value: number): void => {
        storage.set(key, value);
    },
    getNumber: (key: string): number | undefined => {
        return storage.getNumber(key);
    },

    // Boolean operations
    setBoolean: (key: string, value: boolean): void => {
        storage.set(key, value);
    },
    getBoolean: (key: string): boolean | undefined => {
        return storage.getBoolean(key);
    },

    // Object operations (JSON)
    setObject: <T>(key: string, value: T): void => {
        storage.set(key, JSON.stringify(value));
    },
    getObject: <T>(key: string): T | null => {
        const value = storage.getString(key);
        if (value) {
            try {
                return JSON.parse(value) as T;
            } catch {
                return null;
            }
        }
        return null;
    },

    // Delete operations
    remove: (key: string): boolean => {
        return storage.remove(key);
    },
    clearAll: (): void => {
        storage.clearAll();
    },

    // Check if key exists
    contains: (key: string): boolean => {
        return storage.contains(key);
    },

    // Get all keys
    getAllKeys: (): string[] => {
        return storage.getAllKeys();
    },
};

export default StorageService;
