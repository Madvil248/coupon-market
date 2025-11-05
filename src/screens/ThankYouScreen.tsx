import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { UserState } from "../store/userSlice";

interface ThankYouScreenProps {
    userData: UserState;
    onRestart: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onRestart }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onRestart} activeOpacity={1}>
                <Text style={styles.title}>Thank you</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 85,
    },
    title: {
        fontSize: 26,
        fontWeight: "600",
        color: "#009F35",
        textAlign: "center",
    },
});

export default ThankYouScreen;
