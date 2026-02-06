import { create } from 'zustand';

// Types
export type StoreType = 'Retail' | 'Wholesale' | 'Both';

interface OwnerDetails {
    fullName: string;
    mobile: string;
    email: string;
}

interface StoreInfo {
    name: string;
    type: StoreType;
    gstNumber: string;
}

interface LicenseInfo {
    pharmacistRegNumber: string;
}

interface AddressInfo {
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export interface RegistrationFormData {
    owner: OwnerDetails;
    store: StoreInfo;
    license: LicenseInfo;
    addressInfo: AddressInfo;
}

interface RegistrationState {
    // Form Data
    formData: RegistrationFormData;
    
    // UI State
    currentStep: number;
    isSubmitting: boolean;
    validationError: string | null;
    
    // Actions
    updateOwner: (field: keyof OwnerDetails, value: string) => void;
    updateStore: (field: keyof StoreInfo, value: string | StoreType) => void;
    updateLicense: (field: keyof LicenseInfo, value: string) => void;
    updateAddress: (field: keyof AddressInfo, value: string) => void;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setError: (error: string | null) => void;
    setSubmitting: (value: boolean) => void;
    resetForm: () => void;
    
    // Selectors (computed)
    getStepData: (step: number) => Partial<RegistrationFormData>;
}

// Initial state factory - prevents mutation
const createInitialFormData = (): RegistrationFormData => ({
    owner: { fullName: '', mobile: '', email: '' },
    store: { name: '', type: 'Retail', gstNumber: '' },
    license: { pharmacistRegNumber: '' },
    addressInfo: { address: '', city: '', state: '', pincode: '' },
});

// Validation regex - compiled once
const VALIDATION = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mobile: /^[0-9]{10}$/,
    pincode: /^[0-9]{6}$/,
    numericOnly: /[^0-9]/g,
} as const;

export const useRegistrationStore = create<RegistrationState>((set, get) => ({
    // Initial State
    formData: createInitialFormData(),
    currentStep: 1,
    isSubmitting: false,
    validationError: null,

    // Owner Updates - Optimized with single field update
    updateOwner: (field, value) => {
        // Sanitize mobile input
        const sanitizedValue = field === 'mobile' 
            ? value.replace(VALIDATION.numericOnly, '').slice(0, 10)
            : value;
            
        set((state) => ({
            formData: {
                ...state.formData,
                owner: { ...state.formData.owner, [field]: sanitizedValue }
            },
            validationError: null, // Clear error on input
        }));
    },

    // Store Updates
    updateStore: (field, value) => {
        const sanitizedValue = field === 'gstNumber' 
            ? (value as string).toUpperCase()
            : value;
            
        set((state) => ({
            formData: {
                ...state.formData,
                store: { ...state.formData.store, [field]: sanitizedValue }
            },
            validationError: null,
        }));
    },

    // License Updates
    updateLicense: (field, value) => {
        set((state) => ({
            formData: {
                ...state.formData,
                license: { ...state.formData.license, [field]: value }
            },
            validationError: null,
        }));
    },

    // Address Updates
    updateAddress: (field, value) => {
        const sanitizedValue = field === 'pincode'
            ? value.replace(VALIDATION.numericOnly, '').slice(0, 6)
            : value;
            
        set((state) => ({
            formData: {
                ...state.formData,
                addressInfo: { ...state.formData.addressInfo, [field]: sanitizedValue }
            },
            validationError: null,
        }));
    },

    // Navigation
    setStep: (step) => set({ currentStep: step, validationError: null }),
    
    nextStep: () => {
        const { currentStep, formData } = get();
        const error = validateStep(currentStep, formData);
        
        if (error) {
            set({ validationError: error });
            return;
        }
        
        set({ currentStep: Math.min(currentStep + 1, 5), validationError: null });
    },
    
    prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 1),
        validationError: null 
    })),

    // Error & Loading
    setError: (error) => set({ validationError: error }),
    setSubmitting: (value) => set({ isSubmitting: value }),
    
    // Reset
    resetForm: () => set({
        formData: createInitialFormData(),
        currentStep: 1,
        isSubmitting: false,
        validationError: null,
    }),

    // Selector
    getStepData: (step) => {
        const { formData } = get();
        switch (step) {
            case 1: return { owner: formData.owner };
            case 2: return { store: formData.store };
            case 3: return { license: formData.license };
            case 4: return { addressInfo: formData.addressInfo };
            default: return {};
        }
    },
}));

// Pure validation function - outside store for testability
function validateStep(step: number, data: RegistrationFormData): string | null {
    switch (step) {
        case 1: {
            const { fullName, mobile, email } = data.owner;
            if (!fullName.trim()) return 'Full Name is required';
            if (!VALIDATION.mobile.test(mobile)) return 'Valid 10-digit mobile required';
            if (!VALIDATION.email.test(email)) return 'Valid email required';
            return null;
        }
        case 2: {
            if (!data.store.name.trim()) return 'Store Name is required';
            return null;
        }
        case 3: {
            if (!data.license.pharmacistRegNumber.trim()) return 'Registration Number required';
            return null;
        }
        case 4: {
            const { address, city, state, pincode } = data.addressInfo;
            if (!address.trim()) return 'Address required';
            if (!city.trim()) return 'City required';
            if (!state.trim()) return 'State required';
            if (!VALIDATION.pincode.test(pincode)) return 'Valid 6-digit pincode required';
            return null;
        }
        default:
            return null;
    }
}

// Selectors for optimized subscriptions
export const selectCurrentStep = (state: RegistrationState) => state.currentStep;
export const selectOwnerData = (state: RegistrationState) => state.formData.owner;
export const selectStoreData = (state: RegistrationState) => state.formData.store;
export const selectLicenseData = (state: RegistrationState) => state.formData.license;
export const selectAddressData = (state: RegistrationState) => state.formData.addressInfo;
export const selectValidationError = (state: RegistrationState) => state.validationError;
export const selectIsSubmitting = (state: RegistrationState) => state.isSubmitting;
export const selectEmail = (state: RegistrationState) => state.formData.owner.email;
