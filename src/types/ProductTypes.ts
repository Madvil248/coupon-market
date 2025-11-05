export interface ProductPlan {
    durationWeeks: number;
    description: string;
    fullPrice: number;
    discountedPrice: number;
}

export interface DisplayPlan {
    id: string;
    title: string;
    fullPrice: number;
    discountedPrice: number;
    durationDays: number;
    isMostPopular: boolean;
    description?: string;
}

export const PRODUCT_PLANS: ProductPlan[] = [
    {
        durationWeeks: 4,
        description: "Standard Plan",
        fullPrice: 50.0,
        discountedPrice: 25.0, // 50% off intro offer
    },
    {
        durationWeeks: 12,
        description: "Popular Choice",
        fullPrice: 120.0,
        discountedPrice: 60.0, // 50% off intro offer
    },
    {
        durationWeeks: 26,
        description: "Best Value",
        fullPrice: 200.0,
        discountedPrice: 100.0, // 50% off intro offer
    },
];
