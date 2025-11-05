import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { setDiscountState } from "../store/userSlice";
import { setSelectedPlan } from "../store/productsSlice";
import { ProductPlan, DisplayPlan } from "../types/ProductTypes";
import BottomButton from "../components/BottomButton";
import PricingCard from "../components/PricingCard";
import DiscountTimerAndPromo from "../components/DiscountTimerAndPromo";
import { generateDiscountCode } from "../utils/helpers";

const DURATION_SECONDS = 5 * 60;
const HEADER_TEXT = "Choose the best plan for you";

interface ProductScreenProps {
    onNext: (price: number) => void;
}

const ProductScreen: React.FC<ProductScreenProps> = ({ onNext }) => {
    const dispatch = useAppDispatch();

    const {
        discountStartTime,
        promoCode: storedPromoCode,
        name: userName,
    } = useAppSelector((state) => state.user);

    const {
        productPlans: plansFromRedux,
        selectedProductPlan: selectedPlanFromRedux,
    } = useAppSelector((state) => state.products);

    const plansToDisplay = plansFromRedux || [];

    const [currentTime, setCurrentTime] = useState(Date.now());
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
        selectedPlanFromRedux
            ? `${selectedPlanFromRedux.durationWeeks}week`
            : null
    );

    const displayPlans = useMemo(() => {
        return (plansToDisplay as ProductPlan[]).map(
            (plan: ProductPlan, index: number): DisplayPlan => ({
                id: `${plan.durationWeeks}week`,
                title: `${plan.durationWeeks} WEEK PLAN`,
                fullPrice: plan.fullPrice,
                discountedPrice: plan.discountedPrice,
                durationDays: plan.durationWeeks * 7,
                isMostPopular: index === 0,
                description: plan.description,
            })
        );
    }, [plansToDisplay]);

    useEffect(() => {
        if (displayPlans.length > 0 && selectedPlanId === null) {
            if (!selectedPlanFromRedux) {
                setSelectedPlanId(displayPlans[0].id);
            }
        }
    }, [displayPlans, selectedPlanId, selectedPlanFromRedux]);

    const selectedPlan = useMemo(() => {
        return (
            displayPlans.find((p: DisplayPlan) => p.id === selectedPlanId) ||
            (displayPlans.length > 0 ? displayPlans[0] : null)
        );
    }, [selectedPlanId, displayPlans]);

    const promoCodeDisplay = useMemo(() => {
        return storedPromoCode || generateDiscountCode(userName || "user");
    }, [storedPromoCode, userName]);

    const remainingSeconds = useMemo(() => {
        if (!discountStartTime) return 0;

        const elapsedSeconds = Math.floor(
            (currentTime - discountStartTime) / 1000
        );
        return Math.max(0, DURATION_SECONDS - elapsedSeconds);
    }, [discountStartTime, currentTime]);

    const isDiscountActive = remainingSeconds > 0;

    const finalPrice = isDiscountActive
        ? selectedPlan?.discountedPrice || 0
        : selectedPlan?.fullPrice || 0;

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isDiscountActive) {
            interval = setInterval(() => {
                setCurrentTime(Date.now());
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isDiscountActive]);

    useEffect(() => {
        const requiredPromoCode = generateDiscountCode(userName || "user");
        if (!storedPromoCode || storedPromoCode !== requiredPromoCode) {
            const newPromoCode = requiredPromoCode;
            dispatch(
                setDiscountState({
                    discountStartTime: Date.now(),
                    promoCode: newPromoCode,
                })
            );
        }
    }, [userName, storedPromoCode, dispatch]);

    const handlePlanSelect = useCallback((planId: string) => {
        setSelectedPlanId(planId);
    }, []);

    const handleGetMyPlan = useCallback(() => {
        if (selectedPlan) {
            const originalPlan = plansToDisplay.find(
                (p: ProductPlan) => `${p.durationWeeks}week` === selectedPlan.id
            );

            if (originalPlan) {
                dispatch(setSelectedPlan(originalPlan));
            }

            onNext(finalPrice);
        }
    }, [onNext, finalPrice, selectedPlan, dispatch, plansToDisplay]);

    if (plansToDisplay.length === 0 || !selectedPlan) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading Plans...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.header}>{HEADER_TEXT}</Text>
                <DiscountTimerAndPromo
                    isDiscountActive={isDiscountActive}
                    remainingSeconds={remainingSeconds}
                    promoCodeDisplay={promoCodeDisplay}
                    selectedPlan={selectedPlan}
                />
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollViewStyle}
                showsVerticalScrollIndicator={false}
            >
                {displayPlans.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        title={plan.title}
                        fullPrice={plan.fullPrice}
                        discountedPrice={plan.discountedPrice}
                        isDiscountActive={isDiscountActive}
                        durationDays={plan.durationDays}
                        isSelected={plan.id === selectedPlanId}
                        isMostPopular={plan.isMostPopular}
                        onSelect={() => handlePlanSelect(plan.id)}
                    />
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <BottomButton
                    onPress={handleGetMyPlan}
                    disabled={false}
                    text="Get My Plan"
                    iconPlacement="none"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingText: {
        textAlign: "center",
        paddingTop: 50,
        fontSize: 18,
        color: "#6A7280",
    },
    headerSection: {
        zIndex: 10,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#1F2937",
    },
    scrollViewStyle: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 100,
        alignItems: "center",
        gap: 15,
        paddingHorizontal: 20,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 25,
        zIndex: 20,
    },
});

export default ProductScreen;
