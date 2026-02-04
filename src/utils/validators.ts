// ============================================
// Form Validators
// ============================================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
    // Minimum 8 characters, at least one letter and one number
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};

/**
 * Validate GST number (Indian format)
 */
export const isValidGST = (gst: string): boolean => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
};

/**
 * Validate price/amount
 */
export const isValidPrice = (price: number): boolean => {
    return price > 0 && Number.isFinite(price);
};

/**
 * Validate stock quantity
 */
export const isValidStock = (stock: number): boolean => {
    return stock >= 0 && Number.isInteger(stock);
};

/**
 * Validate required field
 */
export const isRequired = (value: string): boolean => {
    return value.trim().length > 0;
};

/**
 * Validate min length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
};

/**
 * Validate pincode (Indian format)
 */
export const isValidPincode = (pincode: string): boolean => {
    return /^[1-9][0-9]{5}$/.test(pincode);
};

// ============================================
// Validation Error Messages
// ============================================

export const ValidationMessages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid 10-digit phone number',
    password: 'Password must be at least 8 characters with letters and numbers',
    gst: 'Please enter a valid GST number',
    price: 'Please enter a valid price',
    stock: 'Please enter a valid stock quantity',
    pincode: 'Please enter a valid 6-digit pincode',
};
