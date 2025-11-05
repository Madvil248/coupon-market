import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import BottomButton from "../components/BottomButton";
import ValidatedInput from "../components/ValidatedInput";
import { validateName } from "../utils/helpers";

interface NameScreenProps {
    initialName: string;
    onNext: (name: string) => void;
}

const HEADER_TEXT = "What’s your name?";

const NameScreen: React.FC<NameScreenProps> = ({ initialName, onNext }) => {
    const [name, setName] = useState(initialName);
    const isButtonEnabled = validateName(name);

    const handleNext = useCallback(() => {
        if (isButtonEnabled) {
            onNext(name.trim());
        }
    }, [name, isButtonEnabled, onNext]);

    return (
        <View style={styles.outerContainer}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.header}>{HEADER_TEXT}</Text>

                    <ValidatedInput
                        value={name}
                        onChangeText={setName}
                        validate={validateName}
                        errorMessage="Please enter a valid name (minimum 2 letters, no special characters)."
                        placeholder="John Doe"
                        autoCapitalize="words"
                        maxLength={50}
                        autoFocus
                    />
                </ScrollView>

                <View style={styles.footer}>
                    <BottomButton
                        onPress={handleNext}
                        disabled={!isButtonEnabled}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#1E293B",
    },
    subheader: {
        fontSize: 16,
        color: "#64748B",
        marginBottom: 30,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
});

export default NameScreen;
