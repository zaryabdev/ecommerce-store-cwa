// Display/normalization for the customer's search text. Mirrors Admin's
// parsing (trim, collapse whitespace, 100-char cap) so the page heading and
// the API request agree. Admin owns term splitting and LIKE escaping; the
// literal text is kept here for display.
const MAX_QUERY_LENGTH = 100;

export function normalizeSearchQuery(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;

  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH).trim();
}
