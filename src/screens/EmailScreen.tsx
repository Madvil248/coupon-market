import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomButton from "../components/BottomButton";
import ValidatedInput from "../components/ValidatedInput";
import { validateEmail } from "../utils/helpers";

interface EmailScreenProps {
    initialEmail: string;
    onNext: (email: string) => void;
}
const HEADER_TEXT =
    "Enter your email to get your personalized Calisthenics Workout Plan";
const PRIVACY_TEXT =
    "We respect your privacy and are committed to protecting your personal data. We'll email you a copy of your results for convenient access.";

const EmailScreen: React.FC<EmailScreenProps> = ({ initialEmail, onNext }) => {
    const [email, setEmail] = useState(initialEmail);
    const isButtonEnabled = validateEmail(email);

    const handleNext = useCallback(() => {
        if (isButtonEnabled) {
            onNext(email);
        }
    }, [email, isButtonEnabled, onNext]);

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
                        value={email}
                        onChangeText={setEmail}
                        validate={validateEmail}
                        errorMessage="Please enter a valid email address (e.g., example@domain.com)."
                        placeholder="yourname@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoFocus
                    />

                    <View style={styles.privacyContainer}>
                        <Ionicons
                            name="lock-closed-sharp"
                            size={16}
                            color="#64748B"
                            style={styles.lockIcon}
                        />
                        <Text style={styles.privacyText}>{PRIVACY_TEXT}</Text>
                    </View>
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
        marginBottom: 20,
        color: "#1E293B",
    },
    privacyContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 10,
        paddingHorizontal: 5,
    },
    lockIcon: {
        marginRight: 8,
        marginTop: Platform.OS === "ios" ? 2 : 1,
    },
    privacyText: {
        flexShrink: 1,
        fontSize: 13,
        lineHeight: 18,
        color: "#64748B",
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
});

export default EmailScreen;
