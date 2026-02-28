"use client";

import { useEffect, useMemo, useState } from "react";

interface CurrencyProps {
    value?: string | number;
    currency?: string; // default "PKR"
    locale?: string; // default "en-PK"
    noDecimals?: boolean; // optional: true => Rs 1,234 (no .00)
}

const Currency: React.FC<CurrencyProps> = ({
    value = 0,
    currency = "PKR",
    locale = "en-PK",
    noDecimals = false,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    const formatter = useMemo(() => {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            maximumFractionDigits: noDecimals ? 0 : 2,
            minimumFractionDigits: noDecimals ? 0 : 2,
        });
    }, [currency, locale, noDecimals]);

    if (!isMounted) return null;

    return (
        <div className="font-semibold">{formatter.format(Number(value))}</div>
    );
};

export default Currency;
