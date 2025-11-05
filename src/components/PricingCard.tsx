import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const COLORS = {
    PRIMARY_BLUE: "#4285F4",
    DISCOUNT_RED: "#D93025",
    TEXT_DARK: "#1F2937",
    TEXT_GRAY: "#A0A0A0",
    CARD_BG_LIGHT: "#FFFFFF",
    CARD_BG_SELECTED: "#EBF5FF",
    CARD_BORDER_GRAY: "#E5E7EB",
};

interface PricingCardProps {
    title: string;
    fullPrice: number;
    discountedPrice: number;
    isDiscountActive: boolean;
    durationDays: number;
    isSelected: boolean;
    onSelect: () => void;
    isMostPopular: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    fullPrice,
    discountedPrice,
    isDiscountActive,
    durationDays,
    isSelected,
    onSelect,
    isMostPopular,
}) => {
    const finalPrice = isDiscountActive ? discountedPrice : fullPrice;
    const perDayPrice = finalPrice / durationDays;

    return (
        <TouchableOpacity
            style={[
                styles.pricingCard,
                isSelected && styles.pricingCardSelected,
                !isMostPopular && { marginBottom: 20 },
            ]}
            onPress={onSelect}
        >
            <View style={styles.contentWrapper}>
                <View style={styles.leftColumn}>
                    <View style={styles.radioContainer}>
                        <View
                            style={[
                                styles.radioDot,
                                isSelected
                                    ? styles.radioDotSelected
                                    : styles.radioDotUnselected,
                            ]}
                        />
                    </View>

                    <View style={styles.planDetails}>
                        <Text
                            style={[
                                styles.planTitle,
                                isSelected && styles.planTitleSelected,
                            ]}
                        >
                            {title.toUpperCase()}
                        </Text>
                        <View style={styles.priceWrapper}>
                            <Text
                                style={[
                                    styles.fullPrice,
                                    isDiscountActive && styles.strikethrough,
                                ]}
                            >
                                ${fullPrice.toFixed(2)} USD
                            </Text>

                            {isDiscountActive && (
                                <Text style={styles.discountedPriceText}>
                                    ${discountedPrice.toFixed(2)} USD
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.perDayPrice}>
                        <Text style={styles.mainPrice}>
                            {perDayPrice.toFixed(2)}
                        </Text>
                        <Text style={styles.mainPriceUnit}> USD</Text>
                    </View>

                    <Text style={styles.perDayText}>per day</Text>
                </View>
            </View>

            {isMostPopular && (
                <View
                    style={[
                        styles.badgeContainer,
                        isSelected && styles.badgeContainerSelected,
                    ]}
                >
                    <Text style={styles.badgeText}>MOST POPULAR</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    pricingCard: {
        backgroundColor: COLORS.CARD_BG_LIGHT,
        borderRadius: 12,
        width: "100%",
        borderWidth: 2,
        borderColor: COLORS.CARD_BORDER_GRAY,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        overflow: "hidden",
    },
    pricingCardSelected: {
        borderColor: COLORS.PRIMARY_BLUE,
        backgroundColor: COLORS.CARD_BG_SELECTED,
        shadowColor: COLORS.PRIMARY_BLUE,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },

    contentWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 25,
    },

    leftColumn: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    radioContainer: {
        paddingRight: 15,
    },
    radioDot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.TEXT_GRAY,
    },
    radioDotUnselected: {
        backgroundColor: "transparent",
        borderColor: COLORS.TEXT_GRAY,
    },
    radioDotSelected: {
        backgroundColor: COLORS.PRIMARY_BLUE,
        borderColor: COLORS.PRIMARY_BLUE,
    },

    planDetails: {},
    planTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
        color: COLORS.TEXT_DARK,
    },
    planTitleSelected: {
        color: COLORS.TEXT_DARK,
    },
    priceWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    fullPrice: {
        fontSize: 12,
        color: COLORS.TEXT_GRAY,
        marginRight: 8,
    },
    strikethrough: {
        textDecorationLine: "line-through",
    },
    discountedPriceText: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.DISCOUNT_RED,
        marginTop: 2,
    },

    rightColumn: {
        alignItems: "flex-start",
        justifyContent: "center",
    },
    perDayPrice: {
        position: "relative",
    },
    mainPrice: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.TEXT_DARK,
        lineHeight: 20,
        paddingRight: 26,
    },
    mainPriceUnit: {
        top: 0,
        right: 0,
        fontSize: 10,
        position: "absolute",
        fontWeight: "normal",
        color: COLORS.TEXT_GRAY,
    },
    perDayText: {
        fontSize: 10,
        marginTop: 5,
        lineHeight: 10,
        color: COLORS.TEXT_GRAY,
        fontStyle: "normal",
    },

    badgeContainer: {
        height: 29,
        marginBottom: -2,
        paddingVertical: 1,
        alignItems: "center",
        paddingHorizontal: 10,
        justifyContent: "center",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: "#A0A0A0",
    },
    badgeContainerSelected: {
        backgroundColor: COLORS.PRIMARY_BLUE,
    },
    badgeText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
});

export default PricingCard;
