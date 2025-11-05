export const validateEmail = (email: string): boolean => {
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const validateName = (name: string): boolean => {
    const re = /^[a-zA-Z\s]{2,}$/;
    return re.test(name.trim());
};

export const generateDiscountCode = (userName: string): string => {
    const date = new Date();
    const month = date
        .toLocaleString("en-US", { month: "short" })
        .toLowerCase();
    const baseName = (userName.split(" ")[0] || "user").toLowerCase();

    return `${baseName}_${month}25`;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);
};
