import React, { useCallback, useMemo, memo, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { FormInput } from '../ui/FormInput';
import { useThemeStore } from '../../stores/useThemeStore';
import {
    useRegistrationStore,
    selectCurrentStep,
    selectOwnerData,
    selectStoreData,
    selectLicenseData,
    selectAddressData,
    selectValidationError,
    selectIsSubmitting,
    selectEmail,
    StoreType,
} from '../../stores/useRegistrationStore';
import LinearGradient from 'react-native-linear-gradient';
import type { ThemeColors } from '../../utils/theme';

// ═══════════════════════════════════════════════════════════
// CONSTANTS - Prevents array allocation on every render
// ═══════════════════════════════════════════════════════════
const STEPS = [1, 2, 3, 4, 5] as const;
const STORE_TYPES: StoreType[] = ['Retail', 'Wholesale', 'Both'];
const GRADIENT_COLORS = ['#CBFB5E', '#a8e063'] as const;

// ═══════════════════════════════════════════════════════════
// MEMOIZED SUB-COMPONENTS - Prevents unnecessary re-renders
// ═══════════════════════════════════════════════════════════

/** Progress Indicator - Only re-renders when step changes */
const ProgressDots = memo<{ currentStep: number }>(({ currentStep }) => (
    <View style={styles.progressRow}>
        {STEPS.map((s) => (
            <View key={s} style={[styles.dot, currentStep >= s && styles.dotActive]} />
        ))}
    </View>
));
ProgressDots.displayName = 'ProgressDots';

/** Step 1: Owner Details */
const OwnerStep = memo<{ colors: ThemeColors }>(({ colors }) => {
    const owner = useRegistrationStore(selectOwnerData);
    const updateOwner = useRegistrationStore((s) => s.updateOwner);

    const handleNameChange = useCallback((v: string) => updateOwner('fullName', v), [updateOwner]);
    const handleMobileChange = useCallback((v: string) => updateOwner('mobile', v), [updateOwner]);
    const handleEmailChange = useCallback((v: string) => updateOwner('email', v), [updateOwner]);

    return (
        <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Owner Details</Text>
            <FormInput
                label="Full Name"
                value={owner.fullName}
                onChangeText={handleNameChange}
                placeholder="Enter your full name"
                colors={colors}
                autoComplete="name"
                returnKeyType="next"
            />
            <FormInput
                label="Mobile Number"
                value={owner.mobile}
                onChangeText={handleMobileChange}
                placeholder="10-digit mobile number"
                colors={colors}
                keyboardType="phone-pad"
                maxLength={10}
                autoComplete="tel"
                returnKeyType="next"
            />
            <FormInput
                label="Email Address"
                value={owner.email}
                onChangeText={handleEmailChange}
                placeholder="your@email.com"
                colors={colors}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="done"
            />
        </View>
    );
});
OwnerStep.displayName = 'OwnerStep';

/** Step 2: Store Information */
const StoreStep = memo<{ colors: ThemeColors; onOpenPicker: () => void }>(({ colors, onOpenPicker }) => {
    const store = useRegistrationStore(selectStoreData);
    const updateStore = useRegistrationStore((s) => s.updateStore);

    const handleNameChange = useCallback((v: string) => updateStore('name', v), [updateStore]);
    const handleGstChange = useCallback((v: string) => updateStore('gstNumber', v), [updateStore]);

    return (
        <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Store Information</Text>
            <FormInput
                label="Store Name"
                value={store.name}
                onChangeText={handleNameChange}
                placeholder="Your pharmacy name"
                colors={colors}
                returnKeyType="next"
            />
            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Store Type</Text>
                <Pressable
                    style={({ pressed }) => [
                        styles.selectBtn,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        pressed && styles.pressed,
                    ]}
                    onPress={onOpenPicker}
                    accessibilityRole="button"
                    accessibilityLabel={`Store type: ${store.type}`}
                >
                    <Text style={[styles.selectText, { color: colors.text }]}>{store.type}</Text>
                    <Text style={{ color: colors.textSecondary }}>▼</Text>
                </Pressable>
            </View>
            <FormInput
                label="GST Number (Optional)"
                value={store.gstNumber}
                onChangeText={handleGstChange}
                placeholder="22AAAAA0000A1Z5"
                colors={colors}
                autoCapitalize="characters"
                returnKeyType="done"
            />
        </View>
    );
});
StoreStep.displayName = 'StoreStep';

/** Step 3: License */
const LicenseStep = memo<{ colors: ThemeColors }>(({ colors }) => {
    const license = useRegistrationStore(selectLicenseData);
    const updateLicense = useRegistrationStore((s) => s.updateLicense);

    const handleRegChange = useCallback(
        (v: string) => updateLicense('pharmacistRegNumber', v),
        [updateLicense]
    );

    return (
        <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Pharmacist License</Text>
            <FormInput
                label="Pharmacist Registration Number"
                value={license.pharmacistRegNumber}
                onChangeText={handleRegChange}
                placeholder="Enter your license number"
                colors={colors}
                returnKeyType="done"
            />
            <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    This is required for verification. Make sure to enter the correct registration
                    number issued by your state pharmacy council.
                </Text>
            </View>
        </View>
    );
});
LicenseStep.displayName = 'LicenseStep';

/** Step 4: Address */
const AddressStep = memo<{ colors: ThemeColors }>(({ colors }) => {
    const addressInfo = useRegistrationStore(selectAddressData);
    const updateAddress = useRegistrationStore((s) => s.updateAddress);

    const handleAddressChange = useCallback((v: string) => updateAddress('address', v), [updateAddress]);
    const handleCityChange = useCallback((v: string) => updateAddress('city', v), [updateAddress]);
    const handleStateChange = useCallback((v: string) => updateAddress('state', v), [updateAddress]);
    const handlePincodeChange = useCallback((v: string) => updateAddress('pincode', v), [updateAddress]);

    return (
        <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Store Address</Text>
            <FormInput
                label="Address"
                value={addressInfo.address}
                onChangeText={handleAddressChange}
                placeholder="Street address, area"
                colors={colors}
                returnKeyType="next"
            />
            <View style={styles.row}>
                <View style={styles.halfField}>
                    <FormInput
                        label="City"
                        value={addressInfo.city}
                        onChangeText={handleCityChange}
                        placeholder="City"
                        colors={colors}
                        returnKeyType="next"
                    />
                </View>
                <View style={styles.halfField}>
                    <FormInput
                        label="State"
                        value={addressInfo.state}
                        onChangeText={handleStateChange}
                        placeholder="State"
                        colors={colors}
                        returnKeyType="next"
                    />
                </View>
            </View>
            <FormInput
                label="Pincode"
                value={addressInfo.pincode}
                onChangeText={handlePincodeChange}
                placeholder="6-digit pincode"
                colors={colors}
                keyboardType="number-pad"
                maxLength={6}
                returnKeyType="done"
            />
        </View>
    );
});
AddressStep.displayName = 'AddressStep';

/** Step 5: Verification */
const VerificationStep = memo<{ colors: ThemeColors }>(({ colors }) => {
    const email = useRegistrationStore(selectEmail);

    return (
        <View style={styles.verificationContent}>
            <LinearGradient colors={GRADIENT_COLORS as unknown as string[]} style={styles.verifyIcon}>
                <Text style={styles.verifyIconText}>⏳</Text>
            </LinearGradient>
            <Text style={[styles.verifyTitle, { color: colors.text }]}>Verification In Progress</Text>
            <View style={[styles.noticeBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                    Your registration is under review. Our team will verify your pharmacy license
                    and store details within <Text style={styles.highlight}>7-24 hours</Text>.
                </Text>
            </View>
            <View style={[styles.noticeBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                    Once verified, you'll receive a confirmation email at{' '}
                    <Text style={styles.highlight}>{email}</Text> with your login credentials.
                </Text>
            </View>
        </View>
    );
});
VerificationStep.displayName = 'VerificationStep';

/** Store Type Picker Modal */
const StoreTypePicker = memo<{
    visible: boolean;
    colors: ThemeColors;
    onClose: () => void;
}>(({ visible, colors, onClose }) => {
    const currentType = useRegistrationStore((s) => s.formData.store.type);
    const updateStore = useRegistrationStore((s) => s.updateStore);

    const handleSelect = useCallback(
        (type: StoreType) => {
            updateStore('type', type);
            onClose();
        },
        [updateStore, onClose]
    );

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalBg} onPress={onClose}>
                <View style={[styles.pickerBox, { backgroundColor: colors.card }]}>
                    <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Store Type</Text>
                    {STORE_TYPES.map((type) => (
                        <Pressable
                            key={type}
                            style={({ pressed }) => [
                                styles.pickerItem,
                                currentType === type && styles.pickerItemActive,
                                pressed && styles.pressed,
                            ]}
                            onPress={() => handleSelect(type)}
                            accessibilityRole="radio"
                            accessibilityState={{ checked: currentType === type }}
                        >
                            <Text
                                style={[
                                    styles.pickerItemText,
                                    { color: currentType === type ? '#CBFB5E' : colors.text },
                                ]}
                            >
                                {type}
                            </Text>
                            {currentType === type && <Text style={styles.checkMark}>✓</Text>}
                        </Pressable>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
});
StoreTypePicker.displayName = 'StoreTypePicker';

/** Navigation Buttons */
const NavigationButtons = memo<{
    step: number;
    isSubmitting: boolean;
    colors: ThemeColors;
    onBack: () => void;
    onNext: () => void;
    onDone: () => void;
}>(({ step, isSubmitting, colors, onBack, onNext, onDone }) => {
    const buttonText = useMemo(() => (step === 4 ? 'Submit' : 'Next'), [step]);
    const showBackButton = step > 1 && step < 5;
    const isLastStep = step === 5;

    return (
        <View style={styles.btnRow}>
            {showBackButton && (
                <Pressable
                    style={({ pressed }) => [
                        styles.backBtn,
                        { borderColor: colors.border },
                        pressed && styles.pressed,
                    ]}
                    onPress={onBack}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Text style={[styles.backBtnText, { color: colors.text }]}>Back</Text>
                </Pressable>
            )}
            {!isLastStep ? (
                <Pressable
                    style={({ pressed }) => [
                        styles.nextBtn,
                        step === 1 && styles.fullWidth,
                        pressed && styles.pressedPrimary,
                        isSubmitting && styles.disabledBtn,
                    ]}
                    onPress={onNext}
                    disabled={isSubmitting}
                    accessibilityRole="button"
                    accessibilityLabel={buttonText}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#000" size="small" />
                    ) : (
                        <Text style={styles.nextBtnText}>{buttonText}</Text>
                    )}
                </Pressable>
            ) : (
                <Pressable
                    style={({ pressed }) => [styles.nextBtn, styles.fullWidth, pressed && styles.pressedPrimary]}
                    onPress={onDone}
                    accessibilityRole="button"
                    accessibilityLabel="Done"
                >
                    <Text style={styles.nextBtnText}>Done</Text>
                </Pressable>
            )}
        </View>
    );
});
NavigationButtons.displayName = 'NavigationButtons';

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function RegisterForm() {
    // Theme - shallow subscription
    const colors = useThemeStore((s) => s.colors);

    // Registration store - optimized selectors
    const step = useRegistrationStore(selectCurrentStep);
    const error = useRegistrationStore(selectValidationError);
    const isSubmitting = useRegistrationStore(selectIsSubmitting);
    const nextStep = useRegistrationStore((s) => s.nextStep);
    const prevStep = useRegistrationStore((s) => s.prevStep);
    const resetForm = useRegistrationStore((s) => s.resetForm);

    // Local UI state
    const [showPicker, setShowPicker] = useState(false);

    // Memoized handlers
    const handleOpenPicker = useCallback(() => setShowPicker(true), []);
    const handleClosePicker = useCallback(() => setShowPicker(false), []);
    const handleDone = useCallback(() => {
        resetForm();
        // Navigate to login or home
        console.log('Registration complete');
    }, [resetForm]);

    // Render current step based on step number
    const renderCurrentStep = useMemo(() => {
        switch (step) {
            case 1:
                return <OwnerStep colors={colors} />;
            case 2:
                return <StoreStep colors={colors} onOpenPicker={handleOpenPicker} />;
            case 3:
                return <LicenseStep colors={colors} />;
            case 4:
                return <AddressStep colors={colors} />;
            case 5:
                return <VerificationStep colors={colors} />;
            default:
                return null;
        }
    }, [step, colors, handleOpenPicker]);

    return (
        <View style={styles.container}>
            {/* Progress Indicator - Fixed at top */}
            <ProgressDots currentStep={step} />

            {/* Form Content - Takes available space */}
            <View style={styles.formContent}>
                {renderCurrentStep}
            </View>

            {/* Error Message */}
            {error && (
                <Text style={styles.errorText} accessibilityRole="alert">
                    {error}
                </Text>
            )}

            {/* Navigation Buttons - Fixed at bottom, always visible */}
            <View style={styles.bottomSection}>
                <NavigationButtons
                    step={step}
                    isSubmitting={isSubmitting}
                    colors={colors}
                    onBack={prevStep}
                    onNext={nextStep}
                    onDone={handleDone}
                />
            </View>

            <StoreTypePicker visible={showPicker} colors={colors} onClose={handleClosePicker} />
        </View>
    );
}

// ═══════════════════════════════════════════════════════════
// STYLES - Static, never re-created
// ═══════════════════════════════════════════════════════════
const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    formContent: { 
        flex: 1,
    },
    bottomSection: {
        paddingTop: 16,
    },
    progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#333' },
    dotActive: { backgroundColor: '#CBFB5E' },
    stepContent: { gap: 16 },
    stepTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    fieldContainer: { gap: 8 },
    label: { fontSize: 14, fontWeight: '500' },
    selectBtn: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectText: { fontSize: 16 },
    row: { flexDirection: 'row', gap: 12 },
    halfField: { flex: 1 },
    infoBox: { padding: 16, borderRadius: 12, marginTop: 8 },
    infoText: { fontSize: 13, lineHeight: 20 },
    btnRow: { flexDirection: 'row', gap: 12 },
    backBtn: {
        paddingHorizontal: 24,
        height: 54,
        borderRadius: 27,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtnText: { fontSize: 16, fontWeight: '600' },
    nextBtn: {
        flex: 1,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#CBFB5E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextBtnText: { fontSize: 17, fontWeight: 'bold', color: '#1a1a1a' },
    fullWidth: { flex: 1 },
    errorText: { color: '#ff4444', textAlign: 'center', marginVertical: 8, fontSize: 14 },
    pressed: { opacity: 0.7 },
    pressedPrimary: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    disabledBtn: { opacity: 0.5 },
    // Verification
    verificationContent: { alignItems: 'center', paddingVertical: 20 },
    verifyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    verifyIconText: { fontSize: 36 },
    verifyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    noticeBox: { padding: 16, borderRadius: 12, marginBottom: 12, width: '100%' },
    noticeText: { fontSize: 14, lineHeight: 22 },
    highlight: { color: '#CBFB5E', fontWeight: 'bold' },
    // Modal
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    pickerBox: { borderRadius: 16, padding: 20 },
    pickerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    pickerItem: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerItemActive: { backgroundColor: '#CBFB5E20' },
    pickerItemText: { fontSize: 16 },
    checkMark: { color: '#CBFB5E', fontSize: 18, fontWeight: 'bold' },
});
