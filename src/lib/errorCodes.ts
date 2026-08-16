/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CUTZO Error Codes  ·  src/lib/errorCodes.ts
 *
 *  Shared decoder for the obfuscated reference codes that appear in the UI.
 *  This file lives in the FRONTEND only — the backend never imports it.
 *
 *  HOW TO READ A CODE (developer guide):
 *  ─────────────────────────────────────
 *  Format:  E-[FN][CAT]-[SCRAMBLE]-[FAILURE]
 *  Example: E-B1AU-74K-101
 *
 *  Segment    Value   Meaning
 *  ─────────  ─────   ──────────────────────────────────────────────────────
 *  E          E       Always "Error"
 *  B1         FN slug Function: bookings.createBooking
 *  AU         CAT     Category: AUTH (authentication failure)
 *  74K        RAND    Deterministic scramble (ignore — for user obfuscation)
 *  101        FP      Failure point: UNAUTHENTICATED (auth check)
 *
 *  Failure point first digit:
 *    1xx = Auth check phase
 *    2xx = Input validation phase
 *    3xx = Database read phase
 *    4xx = Database write phase
 *    5xx = Business rule phase
 *    6xx = External service phase
 *    9xx = Unknown / catch-all
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface DecodedError {
  raw: string;
  fnSlug: string;
  fnName: string;
  catCode: string;
  catName: string;
  scramble: string;
  failureCode: string;
  failureName: string;
  phase: string;
}

// ── Decoder maps (mirror the backend registry) ────────────────────────────────

const FN_NAMES: Record<string, string> = {
  B1:  "bookings.createBooking",
  B2:  "bookings.cancelBooking",
  B3:  "bookings.confirmBooking",
  B4:  "bookings.rescheduleBooking",
  B5:  "bookings.getCustomerBookings",
  B6:  "bookings.getShopBookings",
  B7:  "bookings.verifyOtp",
  S1:  "shops.getShops",
  S2:  "shops.getShopById",
  S3:  "shops.createShop",
  S4:  "shops.updateShop",
  S5:  "shops.updateShopStatus",
  S6:  "shops.toggleShopOpen",
  S7:  "shops.uploadShopImage",
  U1:  "users.getUser",
  U2:  "users.createUser",
  U3:  "users.updateUser",
  P1:  "profile.getProfile",
  P2:  "profile.updateProfile",
  R1:  "reviews.addReview",
  R2:  "reviews.getShopReviews",
  SV1: "services.addService",
  SV2: "services.updateService",
  SV3: "services.deleteService",
  W1:  "walkIns.createWalkIn",
  W2:  "walkIns.completeWalkIn",
  A1:  "auth_actions.createUser",
  RL1: "rateLimit.checkRateLimit",
  L1:  "location.updateLocation",
  XX:  "unknown function",
};

const CAT_NAMES: Record<string, string> = {
  AU: "Authentication / Authorization",
  VL: "Validation / Bad Input",
  DB: "Database Operation",
  RL: "Rate Limit",
  NF: "Resource Not Found",
  BZ: "Business Logic",
  SY: "System / Unknown",
};

const FAILURE_NAMES: Record<string, string> = {
  "101": "UNAUTHENTICATED — user not logged in",
  "102": "UNAUTHORIZED — insufficient permissions",
  "103": "TOKEN_EXPIRED — auth token has expired",
  "201": "MISSING_FIELD — required field absent",
  "202": "INVALID_FORMAT — field format incorrect",
  "203": "OUT_OF_RANGE — value outside allowed range",
  "204": "PAST_DATE — slot/date is in the past",
  "205": "SLOT_TAKEN — time slot already booked",
  "206": "SHOP_CLOSED — shop is not accepting bookings",
  "301": "DB_READ_FAILED — database query error",
  "302": "NOT_FOUND — record does not exist",
  "401": "DB_WRITE_FAILED — could not save data",
  "402": "DUPLICATE — record already exists",
  "501": "MAX_BOOKINGS — booking limit reached",
  "502": "BANNED_USER — user temporarily banned",
  "503": "SHOP_NOT_ACTIVE — shop not operational",
  "601": "RATE_LIMITED — too many requests",
  "602": "PUSH_FAILED — notification delivery failed",
  "901": "UNKNOWN — unexpected error",
};

const PHASE_NAMES: Record<string, string> = {
  "1": "Auth check",
  "2": "Input validation",
  "3": "Database read",
  "4": "Database write",
  "5": "Business rule enforcement",
  "6": "External service call",
  "9": "Unknown phase",
};

// ── Parsed payload from the ConvexError data ─────────────────────────────────
export interface AppErrorPayload {
  code: string;
  userMessage: string;
}

/** Returns true if a ConvexError data object is an AppErrorPayload */
export function isAppErrorPayload(data: unknown): data is AppErrorPayload {
  return (
    typeof data === "object" &&
    data !== null &&
    "code" in data &&
    "userMessage" in data &&
    typeof (data as AppErrorPayload).code === "string" &&
    typeof (data as AppErrorPayload).userMessage === "string"
  );
}

// ── Code parser ────────────────────────────────────────────────────────────────
/**
 * Decodes "E-B1AU-74K-101" into its constituent parts for debugging.
 * Useful when a user sends you a screenshot with the error code.
 */
export function decodeErrorCode(code: string): DecodedError | null {
  // Format: E-{FN}{CAT}-{SCRAMBLE}-{FAILURE}
  const match = code.match(/^E-([A-Z0-9]+)([A-Z]{2})-([A-Z0-9]+)-(\d{3})$/);
  if (!match) return null;

  const [, fnSlug, catCode, scramble, failureCode] = match;
  const phaseDigit = failureCode[0];

  return {
    raw:         code,
    fnSlug,
    fnName:      FN_NAMES[fnSlug]        ?? `Unknown function (${fnSlug})`,
    catCode,
    catName:     CAT_NAMES[catCode]      ?? `Unknown category (${catCode})`,
    scramble,
    failureCode,
    failureName: FAILURE_NAMES[failureCode] ?? `Unknown failure (${failureCode})`,
    phase:       PHASE_NAMES[phaseDigit]    ?? "Unknown phase",
  };
}

/**
 * Formats a decoded error as a human-readable developer report.
 * Paste this into your incident log or paste the screenshot code here.
 */
export function formatDecodedError(code: string): string {
  const d = decodeErrorCode(code);
  if (!d) return `Cannot decode: ${code}`;
  return [
    `━━ CUTZO Error Report ━━`,
    `Code:     ${d.raw}`,
    `Function: ${d.fnName}`,
    `Category: ${d.catName}`,
    `Phase:    ${d.phase}`,
    `Failure:  ${d.failureName}`,
  ].join("\n");
}

/**
 * Extracts AppErrorPayload from a caught error (works with ConvexError).
 * Returns null if this is not a structured app error.
 */
export function extractAppError(err: unknown): AppErrorPayload | null {
  if (!err || typeof err !== "object") return null;

  // ConvexError surfaces its data as err.data
  const data = (err as Record<string, unknown>).data;
  if (isAppErrorPayload(data)) return data;

  // Fallback: check if the error itself has the shape
  if (isAppErrorPayload(err)) return err;

  return null;
}
