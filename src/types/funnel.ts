export interface FunnelData {
    email: string;
    name: string;
    discountCode: string;
    isDiscountActive: boolean;
    finalPrice: number;
    purchaseTimestamp: number | null;
}

export interface UserData {
    email: string;
    name: string;
    pricePaid: number;
}

export type AppStep =
    | "Logo"
    | "Email"
    | "Name"
    | "Product"
    | "Checkout"
    | "ThankYou";
