import Toast, { ToastShowParams } from 'react-native-toast-message';

// ============================================
// Toast Types
// ============================================

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
    title: string;
    message?: string;
    duration?: number;
    position?: 'top' | 'bottom';
}

// ============================================
// Toast Service - Error Handling & Notifications
// ============================================

export const ToastService = {
    /**
     * Show success toast
     */
    success: (options: ToastOptions): void => {
        Toast.show({
            type: 'success',
            text1: options.title,
            text2: options.message,
            position: options.position || 'bottom',
            visibilityTime: options.duration || 3000,
            autoHide: true,
            bottomOffset: 80,
        });
    },

    /**
     * Show error toast
     */
    error: (options: ToastOptions): void => {
        Toast.show({
            type: 'error',
            text1: options.title,
            text2: options.message,
            position: options.position || 'bottom',
            visibilityTime: options.duration || 4000,
            autoHide: true,
            bottomOffset: 80,
        });
    },

    /**
     * Show info toast
     */
    info: (options: ToastOptions): void => {
        Toast.show({
            type: 'info',
            text1: options.title,
            text2: options.message,
            position: options.position || 'bottom',
            visibilityTime: options.duration || 3000,
            autoHide: true,
            bottomOffset: 80,
        });
    },

    /**
     * Show warning toast
     */
    warning: (options: ToastOptions): void => {
        Toast.show({
            type: 'customWarning',
            text1: options.title,
            text2: options.message,
            position: options.position || 'bottom',
            visibilityTime: options.duration || 3500,
            autoHide: true,
            bottomOffset: 80,
        });
    },

    /**
     * Hide current toast
     */
    hide: (): void => {
        Toast.hide();
    },

    /**
     * Show network error toast
     */
    networkError: (): void => {
        Toast.show({
            type: 'error',
            text1: 'Network Error',
            text2: 'Please check your internet connection',
            position: 'bottom',
            visibilityTime: 4000,
            bottomOffset: 80,
        });
    },

    /**
     * Show API error toast
     */
    apiError: (message?: string): void => {
        Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: message || 'Please try again later',
            position: 'bottom',
            visibilityTime: 4000,
            bottomOffset: 80,
        });
    },
};

export default ToastService;
