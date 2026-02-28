export function formatMoney(
    value: number,
    opts?: { currency?: string; locale?: string; noDecimals?: boolean },
) {
    const currency = opts?.currency ?? "PKR";
    const locale = opts?.locale ?? "en-PK";
    const noDecimals = opts?.noDecimals ?? false;

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: noDecimals ? 0 : 2,
        minimumFractionDigits: noDecimals ? 0 : 2,
    }).format(value);
}
