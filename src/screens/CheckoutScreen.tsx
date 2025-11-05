import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
    Image,
    TextInput,
    Platform,
} from "react-native";
import { CardField } from "@stripe/stripe-react-native";
import { useAppSelector } from "../hooks/useRedux";
import { Ionicons } from "@expo/vector-icons";
import { ProductPlan } from "../types/ProductTypes";
import { formatCurrency } from "../utils/helpers";
import BottomButton from "../components/BottomButton";

interface StripeCardDetails {
    last4?: string;
}

interface CheckoutScreenProps {
    onSuccess: (price: number) => void;
}

const mockPayment = (
    cardDetails: StripeCardDetails
): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cardNumberPrefix = cardDetails.last4?.substring(0, 4);

            if (cardNumberPrefix === "0000") {
                resolve({
                    success: false,
                    error: "Payment processor declined the transaction.",
                });
            } else {
                resolve({ success: true });
            }
        }, 1500);
    });
};

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onSuccess }) => {
    const { promoCode: appliedPromoCode } = useAppSelector(
        (state) => state.user
    );

    const { selectedProductPlan } = useAppSelector((state) => state.products);

    // Removed unused 'finalPrice' variable to clear the TypeScript warning.

    const [cardDetails, setCardDetails] = useState<StripeCardDetails | null>(
        null
    );
    const [isCardComplete, setIsCardComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nameOnCard, setNameOnCard] = useState("");

    const summary = useMemo(() => {
        const data = selectedProductPlan as ProductPlan | null;

        const fullPrice = data ? data.fullPrice : 0;
        const planName = data
            ? `${data.durationWeeks} WEEK PLAN`
            : "Custom Plan";

        // The final price (the amount the user pays) is the discounted price.
        const price = data ? data.discountedPrice : 0;

        // Discount is calculated as the difference between the full price and the final price.
        const discountAmount = fullPrice - price;
        const isDiscounted = discountAmount > 0;
        const discountPercentage =
            fullPrice > 0 ? ((discountAmount / fullPrice) * 100).toFixed(0) : 0;

        return {
            planName,
            fullPrice,
            discountAmount,
            discountPercentage,
            isDiscounted,
            appliedPromoCode: appliedPromoCode || "N/A",
            price, // This is the final discounted price
        };
    }, [appliedPromoCode, selectedProductPlan]);

    const handlePayment = async () => {
        if (!isCardComplete || !cardDetails || !nameOnCard) {
            Alert.alert(
                "Missing Details",
                "Please complete all card details and enter the name on the card."
            );
            return;
        }

        setIsLoading(true);

        try {
            const result = await mockPayment(cardDetails);

            if (result.success) {
                onSuccess(summary.price);
            } else {
                Alert.alert(
                    "Payment Failed",
                    result.error || "An unknown error occurred during checkout."
                );
            }
        } catch (e) {
            Alert.alert(
                "Error",
                "A severe error occurred during the mock payment simulation."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardChange = (details: any) => {
        const isComplete = details.complete;
        setIsCardComplete(isComplete);

        if (details.last4) {
            setCardDetails({ last4: details.last4 });
        } else {
            setCardDetails(null);
        }
    };

    const isBuyButtonEnabled = isCardComplete && !!nameOnCard;
    const totalDisplay = formatCurrency(summary.price);
    const fullPriceDisplay = formatCurrency(summary.fullPrice);
    const discountAmountDisplay = formatCurrency(summary.discountAmount);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="always"
                >
                    <View style={styles.innerContainer}>
                        <View style={styles.summaryBox}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.label}>
                                    {summary.planName}
                                </Text>
                                {/* Apply strikethrough to the full price if discounted */}
                                <Text
                                    style={[
                                        styles.value,
                                        summary.isDiscounted && {
                                            textDecorationLine: "line-through",
                                            color: "#6A7280",
                                        },
                                    ]}
                                >
                                    {fullPriceDisplay}
                                </Text>
                            </View>

                            {summary.isDiscounted && (
                                <>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.label}>
                                            Your {summary.discountPercentage}%
                                            intro discount
                                        </Text>
                                        <Text
                                            style={[
                                                styles.value,
                                                styles.discount,
                                            ]}
                                        >
                                            - {discountAmountDisplay}
                                        </Text>
                                    </View>
                                    <View style={styles.couponRow}>
                                        <Ionicons
                                            name="pricetag"
                                            size={20}
                                            style={styles.tagIcon}
                                        />
                                        <Text
                                            style={styles.couponText}
                                            numberOfLines={1}
                                        >
                                            {"Applied promo code: "}
                                            <Text style={styles.couponTextBold}>
                                                {summary.appliedPromoCode}
                                            </Text>
                                        </Text>
                                    </View>
                                    <View style={styles.divider} />
                                </>
                            )}

                            <View style={styles.summaryRow}>
                                <Text style={styles.totalLabel}>
                                    Total today:
                                </Text>
                                <Text style={styles.totalValue}>
                                    {totalDisplay}
                                </Text>
                            </View>
                            {summary.isDiscounted && (
                                <View style={styles.discountRow}>
                                    <Ionicons
                                        name="flame"
                                        size={16}
                                        style={styles.flameIcon}
                                    />
                                    <Text style={styles.discountText}>
                                        You just saved{" "}
                                        {formatCurrency(summary.discountAmount)}{" "}
                                        ({summary.discountPercentage}% OFF)
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.stripeImageContainer}>
                            <Image
                                source={require("../assets/stripePowered.png")}
                                style={styles.stripeImage}
                            />
                        </View>

                        <View style={styles.cardFormContainer}>
                            <CardField
                                cardStyle={styles.cardFormStyle}
                                onCardChange={handleCardChange}
                                style={styles.stripeCardForm}
                                postalCodeEnabled={false}
                            />
                        </View>

                        <View style={styles.nameInputContainer}>
                            <TextInput
                                placeholder="Name on Card"
                                keyboardType="default"
                                onChangeText={setNameOnCard}
                                value={nameOnCard}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.buttonContainerInScroll}>
                            <BottomButton
                                onPress={handlePayment}
                                disabled={!isBuyButtonEnabled}
                                text="Buy Now"
                                loading={isLoading}
                                buttonColor="#009F35"
                                iconName="lock-closed-sharp"
                                iconPlacement="left"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    keyboardAvoiding: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    buttonContainerInScroll: {
        paddingBottom: 20,
    },
    innerContainer: {
        padding: 15,
        borderRadius: 8,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
    },
    summaryBox: {
        borderRadius: 8,
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000000",
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
    },
    discount: {
        color: "#EE5255",
    },
    couponRow: {
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#EFF1F5",
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginTop: 5,
    },
    tagIcon: {
        marginRight: 8,
        color: "#666666",
    },
    couponText: {
        fontSize: 13,
        color: "#666666",
    },
    couponTextBold: {
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "bold",
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000000",
    },
    discountRow: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    flameIcon: {
        color: "#EE5255",
        marginRight: 4,
    },
    discountText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#EE5255",
        textAlign: "center",
    },
    stripeImageContainer: {
        width: 300,
        height: 34,
        marginTop: 10,
        marginBottom: 10,
        overflow: "hidden",
        alignSelf: "center",
    },
    stripeImage: {
        width: 331,
        height: 105,
        marginTop: -48,
        marginLeft: -15,
        resizeMode: "contain",
    },
    cardFormContainer: {
        paddingTop: 20,
        marginBottom: 20,
    },
    cardFormStyle: {
        color: "#333333",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
    },
    stripeCardForm: {
        width: "100%",
        height: 55,
        paddingHorizontal: 10,
    },
    nameInputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: "#6A7280",
        marginBottom: 5,
    },
    textInput: {
        height: 60,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    cancelButton: {
        marginTop: 15,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#0056D6",
        fontSize: 16,
    },
});

export default CheckoutScreen;
