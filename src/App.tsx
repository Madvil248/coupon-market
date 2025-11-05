import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store, { persistor } from "./store";
import { useAppSelector, useAppDispatch } from "./hooks/useRedux";
import {
    updateUserData,
    logSuccessfulPurchase,
    resetFunnel,
    UserState,
    setScreen,
} from "./store/userSlice";
import { AppScreen } from "./types/ScreenTypes";
import { StripeProvider } from "@stripe/stripe-react-native";
import AppHeader from "./components/AppHeader";
import LogoScreen from "./screens/LogoScreen";
import EmailScreen from "./screens/EmailScreen";
import NameScreen from "./screens/NameScreen";
import ProductScreen from "./screens/ProductScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import ThankYouScreen from "./screens/ThankYouScreen";

const STRIPE_MOCK_PK = "pk_test_MOCK_KEY_FOR_SIMULATION";
const screenWidth = Dimensions.get("window").width;

function AppContent() {
    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user);
    const currentScreen = userData.currentScreen;
    const [history, setHistory] = useState<AppScreen[]>([AppScreen.Logo]);

    const handleNext = useCallback(
        (nextScreen: AppScreen, data: Partial<UserState> = {}) => {
            if (Object.keys(data).length > 0) {
                dispatch(updateUserData(data));
            }
            setHistory((prev) => [...prev, nextScreen]);
            dispatch(setScreen(nextScreen));
        },
        [dispatch]
    );

    const handleBack = useCallback(() => {
        if (
            currentScreen !== AppScreen.Logo &&
            currentScreen !== AppScreen.ThankYou
        ) {
            setHistory((prev) => {
                if (prev.length > 1) {
                    const newHistory = prev.slice(0, -1);
                    const previousScreen = newHistory[newHistory.length - 1];
                    dispatch(setScreen(previousScreen));
                    return newHistory;
                }
                return prev;
            });
        }
    }, [currentScreen, dispatch]);

    const navigationHandlers = useMemo(
        () => ({
            onToEmail: () => handleNext(AppScreen.EmailInput),
            onToName: (email: string) =>
                handleNext(AppScreen.NameInput, { email }),
            onToPricing: (name: string) =>
                handleNext(AppScreen.Pricing, { name }),
            onToCheckout: (price: number) =>
                handleNext(AppScreen.Checkout, { pricePaid: price }),
            onToThankYou: (price: number) => {
                dispatch(
                    logSuccessfulPurchase({
                        name: userData.name,
                        email: userData.email,
                        pricePaid: price,
                    })
                );
                handleNext(AppScreen.ThankYou);
            },
            onRestart: () => {
                dispatch(resetFunnel());
                setHistory([AppScreen.Logo]);
            },
        }),
        [dispatch, handleNext, userData.email, userData.name]
    );

    const needsBackButton =
        history.length > 1 &&
        currentScreen !== AppScreen.ThankYou &&
        currentScreen !== AppScreen.EmailInput;

    const needsHeader = currentScreen !== AppScreen.Logo;

    const getHeaderTitle = (screen: AppScreen) => {
        switch (screen) {
            case AppScreen.Checkout:
                return "Complete Checkout";
            default:
                return undefined;
        }
    };

    const headerTitle = getHeaderTitle(currentScreen);

    const renderScreen = () => {
        const mockedProps = {
            navigation: { goBack: handleBack } as any,
            route: {} as any,
        };

        switch (currentScreen) {
            case AppScreen.Logo:
                return (
                    <LogoScreen
                        {...mockedProps}
                        onNext={navigationHandlers.onToEmail}
                    />
                );
            case AppScreen.EmailInput:
                return (
                    <EmailScreen
                        {...mockedProps}
                        initialEmail={userData.email}
                        onNext={navigationHandlers.onToName}
                    />
                );
            case AppScreen.NameInput:
                return (
                    <NameScreen
                        {...mockedProps}
                        initialName={userData.name}
                        onNext={navigationHandlers.onToPricing}
                    />
                );
            case AppScreen.Pricing:
                return (
                    <ProductScreen
                        {...mockedProps}
                        onNext={navigationHandlers.onToCheckout}
                    />
                );
            case AppScreen.Checkout:
                return (
                    <CheckoutScreen
                        {...mockedProps}
                        onSuccess={navigationHandlers.onToThankYou}
                    />
                );
            case AppScreen.ThankYou:
                return (
                    <ThankYouScreen
                        {...mockedProps}
                        userData={userData}
                        onRestart={navigationHandlers.onRestart}
                    />
                );
            default:
                return (
                    <LogoScreen
                        {...mockedProps}
                        onNext={navigationHandlers.onToEmail}
                    />
                );
        }
    };

    return (
        <View style={styles.container}>
            {needsHeader && (
                <AppHeader
                    onBack={needsBackButton ? handleBack : undefined}
                    title={headerTitle}
                />
            )}
            <View
                style={
                    needsHeader ? styles.contentWithHeader : styles.contentFull
                }
            >
                {renderScreen()}
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <StripeProvider
                publishableKey={STRIPE_MOCK_PK}
                merchantIdentifier="merchant.com.momentum.mock"
            >
                <Provider store={store}>
                    <PersistGate
                        loading={<ActivityIndicator size="large" />}
                        persistor={persistor}
                    >
                        {/* NavigationContainer is removed */}
                        <AppContent />
                    </PersistGate>
                </Provider>
            </StripeProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFF1F5",
    },
    contentFull: {
        flex: 1,
        padding: 0,
    },
    contentWithHeader: {
        flex: 1,
        padding: 0,
    },
});
