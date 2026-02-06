import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { ThemeColors } from '../../utils/theme';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    colors: ThemeColors;
    onTogglePassword?: () => void;
    isPassword?: boolean;
}

export const FormInput = React.memo(({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    colors,
    onTogglePassword,
    isPassword,
    ...textInputProps
}: FormInputProps) => (
    <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
                style={[styles.input, { color: colors.text }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={secureTextEntry}
                {...textInputProps}
            />
            {isPassword && (
                <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
                    {secureTextEntry ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color="#CBFB5E" />}
                </TouchableOpacity>
            )}
        </View>
    </View>
));

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 4,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
});
