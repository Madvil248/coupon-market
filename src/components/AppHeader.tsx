import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGO_IMAGE = require("../assets/header_logo.png");

interface AppHeaderProps {
    onBack?: () => void;
    title?: string;
    hideLogo?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    onBack,
    title,
    hideLogo = false,
}) => {
    // ⬅️ 2. Get the safe area insets
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.leftContainer}>
                {onBack && (
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={30} color="#000" />
                    </TouchableOpacity>
                )}
            </View>

            {!hideLogo && (
                <View style={styles.centerContainer}>
                    {/* Display title or logo, prioritizing title if provided */}
                    {title ? (
                        <Text style={styles.logoText}>{title}</Text>
                    ) : (
                        <Image
                            source={LOGO_IMAGE}
                            style={styles.logoIcon}
                            resizeMode="contain"
                        />
                    )}
                </View>
            )}

            {/* Right container maintains horizontal balance */}
            <View style={styles.rightContainer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",

        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 0,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        backgroundColor: "#fff",
        width: "100%",
    },
    leftContainer: {
        width: 50,
        alignItems: "flex-start",
    },
    centerContainer: {
        flex: 1,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    rightContainer: {
        width: 50,
    },
    backButton: {
        padding: 8,
    },
    logoIcon: {
        height: 30,
        width: "100%",
        marginRight: 5,
    },
    logoText: {
        fontSize: 26,
        fontWeight: "500",
        color: "#000000",
    },
});

export default AppHeader;
