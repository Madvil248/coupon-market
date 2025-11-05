import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DisplayPlan } from "../types/ProductTypes";

const COLORS = {
    PRIMARY: "#39C662",
    TEXT: "#333333",
    BACKGROUND: "#B5D9CD",
    TIMER_BG: "#CEEAE2",
    DASHED_LINE: "#75A898",
    EXPIRED_RED: "#D93025",
};

interface DiscountTimerAndPromoProps {
    isDiscountActive: boolean;
    remainingSeconds: number;
    promoCodeDisplay: string;
    selectedPlan: DisplayPlan;
}

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, "0")} : ${seconds
        .toString()
        .padStart(2, "0")}`;
};

const DiscountTimerAndPromo: React.FC<DiscountTimerAndPromoProps> = ({
    isDiscountActive,
    remainingSeconds,
    promoCodeDisplay,
}) => {
    const bannerStyle = styles.activeBanner;
    const timerBgStyle = styles.activeTimerBg;
    const checkmarkIconColor = styles.checkmarkIcon;

    const timerTextStyle = isDiscountActive
        ? styles.activePrimaryText
        : styles.expiredTimerText;

    return (
        <View style={styles.container}>
            <View style={[styles.topBanner, bannerStyle]}>
                <Ionicons name="pricetag" size={20} style={styles.tagIcon} />
                <Text style={styles.promoAppliedText}>
                    Your Promo Code is Applied!
                </Text>
            </View>

            <View style={styles.separatorWrapper}>
                <View style={[styles.separatorCircle, styles.leftCircle]} />
                <View style={styles.dashedSeparator} />
                <View style={[styles.separatorCircle, styles.rightCircle]} />
            </View>

            <View style={[styles.bottomContent, bannerStyle]}>
                <View style={styles.promoCodeWrapper}>
                    <Ionicons
                        name="checkmark"
                        size={16}
                        style={checkmarkIconColor}
                    />
                    <Text style={styles.promoCodeDisplay} numberOfLines={1}>
                        {promoCodeDisplay}
                    </Text>
                </View>

                <View style={[styles.timerWrapper, timerBgStyle]}>
                    <Text style={[styles.timerText, timerTextStyle]}>
                        {isDiscountActive
                            ? formatTime(remainingSeconds)
                            : "00 : 00"}
                    </Text>
                    <View style={styles.timerUnitsRow}>
                        <Text style={styles.timerUnitText}>minutes</Text>
                        <Text style={styles.timerUnitText}>seconds</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    activeBanner: {
        backgroundColor: COLORS.BACKGROUND,
    },
    activePrimaryText: {
        color: COLORS.PRIMARY,
    },
    expiredTimerText: {
        color: COLORS.EXPIRED_RED,
    },
    activeTimerBg: {
        backgroundColor: COLORS.TIMER_BG,
    },

    container: {
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: COLORS.BACKGROUND,
    },

    topBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    tagIcon: {
        marginRight: 8,
        color: "#87CCBA",
    },
    promoAppliedText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.TEXT,
    },
    checkmarkIcon: {
        color: COLORS.PRIMARY,
    },

    separatorWrapper: {},
    dashedSeparator: {
        height: 1,
        borderWidth: 1,
        borderStyle: "dashed",
        marginHorizontal: 15,
        opacity: 0.6,
        borderColor: COLORS.DASHED_LINE,
    },
    separatorCircle: {
        height: 20,
        width: 20,
        borderRadius: 50,
        backgroundColor: "#EFF1F5",
        position: "absolute",
        top: -10,
        zIndex: 2,
    },
    leftCircle: {
        left: -10,
    },
    rightCircle: {
        right: -10,
    },

    bottomContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        paddingTop: 20,
        paddingBottom: 20,
    },

    promoCodeWrapper: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#75A898",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    promoCodeDisplay: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.TEXT,
        marginLeft: 8,
        paddingRight: 20,
    },

    timerWrapper: {
        width: 103,
        alignItems: "center",
        borderRadius: 10,
        paddingVertical: 10,
    },
    timerText: {
        fontSize: 24,
        // fontWeight: "normal",
        fontVariant: ["tabular-nums"],
        marginBottom: 0,
        padding: 0,
        lineHeight: 18,
    },
    timerUnitsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },
    timerUnitText: {
        fontSize: 10,
        color: COLORS.TEXT,
        textTransform: "lowercase",
    },
});

export default DiscountTimerAndPromo;
