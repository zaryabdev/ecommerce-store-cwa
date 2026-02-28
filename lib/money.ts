export function formatMoney(value: number, currency = "USD") {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
    }).format(value);
}
