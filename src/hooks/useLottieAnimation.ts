/**
 * useLottieAnimation
 * ──────────────────
 * Mounts a Lottie animation onto a DOM element ref using data that was
 * statically bundled at build time (no network fetch ever occurs).
 *
 * Usage:
 *   const { ref, stop, play, pause } = useLottieAnimation("bookingSuccess", {
 *     loop: false,
 *     autoplay: true,
 *     speed: 1,
 *   });
 *   return <div ref={ref} style={{ width: 200, height: 200 }} />;
 */

import { useEffect, useRef, useCallback } from "react";
import lottie, { AnimationItem } from "lottie-web";
import { animations, AnimationKey } from "@/assets/animations";

interface LottieOptions {
  /** Whether the animation loops. Default: true */
  loop?: boolean;
  /** Whether to auto-start on mount. Default: true */
  autoplay?: boolean;
  /** Playback speed multiplier. Default: 1 */
  speed?: number;
  /** Renderer — "svg" is smallest and crispest on mobile. Default: "svg" */
  renderer?: "svg" | "canvas" | "html";
  /** Called when the animation completes (non-looping). */
  onComplete?: () => void;
}

interface LottieControls {
  /** Attach this ref to the container <div>. */
  ref: React.RefObject<HTMLDivElement>;
  /** Resumes playback. */
  play: () => void;
  /** Pauses playback. */
  pause: () => void;
  /** Stops and resets to frame 0. */
  stop: () => void;
  /** Replays from frame 0. */
  replay: () => void;
}

export function useLottieAnimation(
  key: AnimationKey,
  options: LottieOptions = {}
): LottieControls {
  const {
    loop = true,
    autoplay = true,
    speed = 1,
    renderer = "svg",
    onComplete,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animData = animations[key];

    // Guard: if the animation data is an empty stub (placeholder), bail out.
    if (!animData || Object.keys(animData).length === 0) {
      console.warn(
        `[useLottieAnimation] Animation "${key}" is a placeholder stub. ` +
        `Drop the real .json file into src/assets/animations/ and import it in index.ts.`
      );
      return;
    }

    // Destroy any previous instance that might be mounted on the same node
    instanceRef.current?.destroy();

    const anim = lottie.loadAnimation({
      container,
      renderer,
      loop,
      autoplay,
      // animationData instead of path → 100% local, bundled in APK
      animationData: animData,
    });

    anim.setSpeed(speed);

    if (onComplete) {
      anim.addEventListener("complete", onComplete);
    }

    instanceRef.current = anim;

    return () => {
      anim.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, loop, autoplay, speed, renderer]);

  const play    = useCallback(() => instanceRef.current?.play(), []);
  const pause   = useCallback(() => instanceRef.current?.pause(), []);
  const stop    = useCallback(() => instanceRef.current?.stop(), []);
  const replay  = useCallback(() => {
    instanceRef.current?.stop();
    instanceRef.current?.play();
  }, []);

  return { ref: containerRef, play, pause, stop, replay };
}
