/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  useAppMutation  ·  src/hooks/useAppMutation.ts
 *
 *  A thin wrapper around Convex's useMutation that:
 *   1. Runs the mutation
 *   2. On error, calls parseError() to extract the structured payload
 *   3. Fires an error toast with the screenshot-ready reference code
 *   4. Re-throws so callers can still handle errors if they need to
 *
 *  Usage:
 *    const createBooking = useAppMutation(api.bookings.createBooking);
 *    await createBooking({ ... });  // toast fires automatically on error
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useMutation } from "convex/react";
import { FunctionReference, FunctionReturnType, FunctionArgs } from "convex/react";
import { parseError } from "@/lib/errorUtils";
import { showErrorToast } from "@/components/cutzo/ErrorToast";

export function useAppMutation<Fn extends FunctionReference<"mutation">>(
  fn: Fn,
) {
  const mutate = useMutation(fn);

  return async (args: FunctionArgs<Fn>): Promise<FunctionReturnType<Fn>> => {
    try {
      return await mutate(args);
    } catch (err) {
      const parsed = parseError(err);
      showErrorToast(parsed.userMessage, parsed.referenceCode ?? undefined);
      throw err; // re-throw so call-sites can do their own cleanup if needed
    }
  };
}
