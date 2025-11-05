// screens/LogoScreen.tsx

import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Image } from "react-native";

const LOGO_IMAGE = require("../assets/logo.png");

interface LogoScreenProps {
    onNext: () => void;
}

const LogoScreen: React.FC<LogoScreenProps> = ({ onNext }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onNext();
        }, 2000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <View style={styles.container}>
            <Image
                source={LOGO_IMAGE}
                style={styles.logoImage}
                resizeMode="contain"
            />
            <View style={styles.spacer} />
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    // ⬅️ New style for the imported image
    logoImage: {
        width: 150, // Adjust size as needed
        height: 150, // Adjust size as needed
        marginBottom: 10,
    },
    logoText: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#0056D6",
    },
    spacer: {
        height: 50,
    },
});

export default LogoScreen;
