#!/usr/bin/env node
/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CUTZO Error Decoder CLI  ·  tools/decode-error.mjs
 *
 *  Usage:
 *    node tools/decode-error.mjs E-B1AU-74K-101
 *    node tools/decode-error.mjs E-S3BZ-M2X-501
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Decoder tables (mirror src/lib/errorCodes.ts) ────────────────────────────

const FN_NAMES = {
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

const CAT_NAMES = {
  AU: "Authentication / Authorization failure",
  VL: "Validation / Bad input",
  DB: "Database operation failure",
  RL: "Rate limit exceeded",
  NF: "Resource not found",
  BZ: "Business logic violation",
  SY: "System / Unknown error",
};

const FAILURE_NAMES = {
  "101": "UNAUTHENTICATED — user is not logged in",
  "102": "UNAUTHORIZED — insufficient permissions",
  "103": "TOKEN_EXPIRED — auth token has expired",
  "201": "MISSING_FIELD — required field is absent",
  "202": "INVALID_FORMAT — field format is incorrect",
  "203": "OUT_OF_RANGE — value outside allowed range",
  "204": "PAST_DATE — booking slot is in the past",
  "205": "SLOT_TAKEN — time slot is already booked",
  "206": "SHOP_CLOSED — shop is not accepting bookings",
  "301": "DB_READ_FAILED — database query error",
  "302": "NOT_FOUND — record does not exist",
  "401": "DB_WRITE_FAILED — could not save data",
  "402": "DUPLICATE — record already exists",
  "501": "MAX_BOOKINGS — user booking limit reached",
  "502": "BANNED_USER — user temporarily banned (no-shows)",
  "503": "SHOP_NOT_ACTIVE — shop is not operational",
  "601": "RATE_LIMITED — too many requests",
  "602": "PUSH_FAILED — push notification delivery failed",
  "901": "UNKNOWN — unexpected / unclassified error",
};

const PHASE_NAMES = {
  "1": "Auth check",
  "2": "Input validation",
  "3": "Database read",
  "4": "Database write",
  "5": "Business rule enforcement",
  "6": "External service call",
  "9": "Unknown / catch-all",
};

// ── Decoder function ──────────────────────────────────────────────────────────

function decode(code) {
  const match = code.trim().match(/^E-([A-Z0-9]+)([A-Z]{2})-([A-Z0-9]+)-(\d{3})$/);
  if (!match) {
    console.error(`❌  Cannot parse code: "${code}"`);
    console.error(`    Expected format: E-[FN][CAT]-[SCRAMBLE]-[FAILURE]  (e.g. E-B1AU-74K-101)`);
    process.exit(1);
  }

  const [, fnSlug, catCode, scramble, failureCode] = match;
  const phaseDigit = failureCode[0];

  const GREEN  = "\x1b[32m";
  const YELLOW = "\x1b[33m";
  const CYAN   = "\x1b[36m";
  const RED    = "\x1b[31m";
  const BOLD   = "\x1b[1m";
  const RESET  = "\x1b[0m";

  console.log("");
  console.log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${BOLD}  CUTZO Error Decoder${RESET}`);
  console.log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  ${BOLD}Code:${RESET}      ${RED}${code}${RESET}`);
  console.log(`  ${BOLD}Function:${RESET}  ${CYAN}${FN_NAMES[fnSlug] ?? `Unknown (${fnSlug})`}${RESET}`);
  console.log(`  ${BOLD}Category:${RESET}  ${YELLOW}${CAT_NAMES[catCode] ?? `Unknown (${catCode})`}${RESET}`);
  console.log(`  ${BOLD}Phase:${RESET}     ${GREEN}${PHASE_NAMES[phaseDigit] ?? "Unknown"}${RESET}`);
  console.log(`  ${BOLD}Failure:${RESET}   ${YELLOW}${FAILURE_NAMES[failureCode] ?? `Unknown (${failureCode})`}${RESET}`);
  console.log(`  ${BOLD}Scramble:${RESET}  ${scramble} (obfuscation only — ignore)`);
  console.log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  ${BOLD}Action:${RESET} Search Convex Dashboard → Functions → Logs`);
  console.log(`          for ${RED}[CUTZO ERR] code=${code}${RESET}`);
  console.log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log("");
}

// ── Entry point ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node tools/decode-error.mjs <ERROR_CODE>");
  console.log("Example: node tools/decode-error.mjs E-B1AU-74K-101");
  process.exit(0);
}

args.forEach(decode);
