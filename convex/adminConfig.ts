// convex/adminConfig.ts
// Admin Firebase token identifiers allowlist.
// The token identifier format is: "https://accounts.google.com|FIREBASE_UID"
//
// DIRECT ACCESS MODE:
// We have added "*" to enable direct access for initial setup and testing.
// Any logged-in user will be granted admin access.
// When you are ready to lock down the dashboard, remove "*" and add your specific Firebase UID(s).

export const ADMIN_TOKEN_IDENTIFIERS: string[] = [
  "*", // DIRECT ACCESS MODE ENABLED — allow any authenticated user
  // "https://accounts.google.com|YOUR_FIREBASE_UID_HERE",
];

/**
 * Throws "Unauthorized: Admin access required" if the given tokenIdentifier
 * is not in the admin allowlist.
 */
export function assertAdmin(tokenIdentifier: string | null | undefined): void {
  if (!tokenIdentifier) {
    throw new Error("Unauthorized: Authentication required");
  }
  if (ADMIN_TOKEN_IDENTIFIERS.includes("*")) {
    return; // Direct access mode: allow any authenticated user
  }
  const isAllowed = ADMIN_TOKEN_IDENTIFIERS.some(
    (id) => tokenIdentifier === id || tokenIdentifier.endsWith(`|${id}`) || id.endsWith(`|${tokenIdentifier}`)
  );
  if (!isAllowed) {
    throw new Error("Unauthorized: Admin access required");
  }
}
