import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TargetedEvent,
    TextInputProps,
    NativeSyntheticEvent,
} from "react-native";

interface ValidatedInputProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    validate: (value: string) => boolean;
    errorMessage: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
    value,
    onChangeText,
    validate,
    errorMessage,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const isValid = validate(value);
    const showError = hasInteracted && !isValid;

    const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
        setIsFocused(false);
        setHasInteracted(true);
        if (rest.onBlur) rest.onBlur(e);
    };

    const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
        setIsFocused(true);
        // Pass the event 'e' to the original handler
        if (rest.onFocus) rest.onFocus(e);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    showError && styles.inputError, // Apply error style
                ]}
                onChangeText={onChangeText}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...rest}
            />

            {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    input: {
        height: 55,
        borderBottomWidth: 2,
        borderBottomColor: "#E2E8F0",
        paddingHorizontal: 15,
        fontSize: 18,
        color: "#1E293B",
        marginBottom: 8,
        textAlign: "center",
    },
    inputFocused: {
        borderBottomColor: "#000000",
    },
    inputError: {
        borderBottomColor: "#EF4444",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 5,
        fontWeight: "500",
    },
});

export default ValidatedInput;
