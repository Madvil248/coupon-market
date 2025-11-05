import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
    GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconPlacement = "left" | "right" | "none";

interface BottomButtonProps {
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    text?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconPlacement?: IconPlacement;
    loading?: boolean;
    buttonColor?: string;
}

const BottomButton: React.FC<BottomButtonProps> = ({
    onPress,
    disabled = false,
    text = "Continue",
    iconName = "arrow-forward-sharp",
    iconPlacement = "right",
    loading = false,
    buttonColor,
}) => {
    const buttonStyle = [
        styles.buttonBase,
        disabled ? styles.buttonDisabled : styles.buttonActive,
        buttonColor ? { backgroundColor: buttonColor } : {},
    ];

    const renderIcon = () => (
        <Ionicons
            name={iconName}
            size={20}
            color={styles.buttonText.color}
            style={
                iconPlacement === "right" ? styles.iconRight : styles.iconLeft
            }
        />
    );

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={styles.buttonText.color} />
            ) : (
                <View style={styles.contentContainer}>
                    {iconPlacement === "left" && renderIcon()}

                    <Text style={styles.buttonText}>{text}</Text>

                    {iconPlacement === "right" && renderIcon()}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        height: 60,
        borderRadius: 50,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginHorizontal: 0,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonActive: {
        backgroundColor: "#0F0F0F",
    },
    buttonDisabled: {
        backgroundColor: "#000000",
        opacity: 0.5,
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    iconRight: {
        marginLeft: 10,
    },
    iconLeft: {
        marginRight: 10,
    },
});

export default BottomButton;
