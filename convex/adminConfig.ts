// convex/adminConfig.ts
// Admin Firebase token identifiers allowlist.
// The token identifier format is: "https://accounts.google.com|FIREBASE_UID"
// You can find yours by logging into the app and checking your Convex dashboard
// → Functions → any authenticated query log → the "subject" / tokenIdentifier field.
// Or simply add your raw Firebase UID here — if Convex auth is configured with
// Firebase, the tokenIdentifier will be "https://...firebase...com|YOUR_UID".
// Leave empty to lock out all users until you add your UID.

export const ADMIN_TOKEN_IDENTIFIERS: string[] = [
  // "https://accounts.google.com|YOUR_FIREBASE_UID_HERE",
  // Add your Firebase UID or Convex tokenIdentifier here.
];

/**
 * Throws "Unauthorized: Admin access required" if the given tokenIdentifier
 * is not in the admin allowlist.
 */
export function assertAdmin(tokenIdentifier: string | null | undefined): void {
  if (!tokenIdentifier || !ADMIN_TOKEN_IDENTIFIERS.includes(tokenIdentifier)) {
    throw new Error("Unauthorized: Admin access required");
  }
}
