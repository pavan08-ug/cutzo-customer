/**
 * ─── Cutzo Animation Asset Registry ────────────────────────────────────────
 *
 * ALL Lottie animations must be imported here using static `import` statements
 * so Vite/Rollup can tree-shake, inline (or chunk) them at build time.
 *
 * HOW TO ADD A NEW ANIMATION
 * ──────────────────────────
 * 1. Download your .json file from LottieFiles / wherever.
 * 2. Drop it into  src/assets/animations/
 * 3. Add a static import below.
 * 4. Add the key to the `AnimationKey` union type.
 * 5. Add the entry to the `animations` map.
 * 6. Use it anywhere:  useLottieAnimation("myNewKey")
 *
 * WHY STATIC IMPORTS?
 * ───────────────────
 * Dynamic require() / fetch() at runtime == network round-trip or bundler miss.
 * Static `import animData from "./foo.json"` tells Rollup to embed the JSON
 * directly into the JS chunk — the file ships in the APK and is parsed from
 * memory, never from the network.
 *
 * OPTIMISATION TIPS (keep APK lean)
 * ──────────────────────────────────
 * • Run each .json through https://lottiefiles.com/tools/lottie-to-json
 *   → "Optimize" to strip unused layers, pre-flatten keyframes.
 * • Target < 50 KB per animation after optimisation (gzip shrinks further).
 * • Prefer vector-only animations; rasterised image layers bloat the .json.
 * • Remove hidden / muted layers in the source After Effects project before
 *   exporting with Bodymovin.
 */

// ─── Static imports (add yours here) ────────────────────────────────────────
//
// Example (uncomment after dropping the file in):
//   import splashLoopData    from "./splash_loop.json";
//   import bookingSuccessData from "./booking_success.json";
//   import calendarPickData  from "./calendar_pick.json";
//   import loadingDotsData   from "./loading_dots.json";
//   import emptyStateData    from "./empty_state.json";
//
// Placeholder: we ship an inline stub so the app compiles with zero .json
// files present. Replace with real imports as you add files.
const splashLoopData: object = {};
const bookingSuccessData: object = {};
const loadingDotsData: object = {};
const emptyStateData: object = {};
const calendarPickData: object = {};

// ─── Type-safe animation key union ──────────────────────────────────────────
export type AnimationKey =
  | "splashLoop"
  | "bookingSuccess"
  | "loadingDots"
  | "emptyState"
  | "calendarPick";

// ─── Registry map ────────────────────────────────────────────────────────────
export const animations: Record<AnimationKey, object> = {
  splashLoop:     splashLoopData,
  bookingSuccess: bookingSuccessData,
  loadingDots:    loadingDotsData,
  emptyState:     emptyStateData,
  calendarPick:   calendarPickData,
};

export default animations;
