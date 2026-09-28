"use client";

import { useMemo } from "react";

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
    noDecimals = true,
}) => {
    // No isMounted gate: locale/currency are fixed explicit arguments (not
    // derived from the browser's system locale), so Intl.NumberFormat
    // produces the same output on the server and the client — there is no
    // hydration mismatch to guard against here.
    const formatter = useMemo(() => {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            maximumFractionDigits: noDecimals ? 0 : 2,
            minimumFractionDigits: noDecimals ? 0 : 2,
        });
    }, [currency, locale, noDecimals]);

    return (
        <div className="font-semibold text-foreground">{formatter.format(Number(value))}</div>
    );
};

export default Currency;
