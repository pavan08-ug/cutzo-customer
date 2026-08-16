/**
 * useAnimationPreloader
 * ─────────────────────
 * Pre-parses every bundled Lottie JSON into lottie-web's internal format
 * DURING the splash screen so that when an animation is first rendered
 * elsewhere in the app it is already in memory — zero parse stutter.
 *
 * How it works
 * ────────────
 * 1. We iterate over every entry in the animation registry.
 * 2. For each entry we mount an invisible off-screen lottie instance.
 *    lottie.loadAnimation() with animationData causes immediate synchronous
 *    JSON parse → the data is resident in the browser's JS heap.
 * 3. Once all load events fire we set `isReady = true`.
 * 4. The splash screen waits on `isReady` before dismissing.
 * 5. On unmount all temp instances are destroyed (memory is NOT freed —
 *    lottie caches internally, which is the desired behaviour).
 *
 * Usage:
 *   const { isReady, progress } = useAnimationPreloader();
 *   if (!isReady) return <SplashScreen progress={progress} />;
 */

import { useEffect, useState, useRef } from "react";
import lottie from "lottie-web";
import { animations, AnimationKey } from "@/assets/animations";

interface PreloaderResult {
  /** True once every animation has been parsed into memory. */
  isReady: boolean;
  /** 0–100 progress for a loading bar. */
  progress: number;
}

export function useAnimationPreloader(): PreloaderResult {
  const [loaded, setLoaded]     = useState(0);
  const [total, setTotal]       = useState(0);
  const instancesRef            = useRef<ReturnType<typeof lottie.loadAnimation>[]>([]);
  const containerRef            = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create a hidden off-screen container to mount temp instances
    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;pointer-events:none;visibility:hidden;";
    document.body.appendChild(container);
    containerRef.current = container;

    const keys = Object.keys(animations) as AnimationKey[];

    // Filter out placeholder stubs (empty objects)
    const validKeys = keys.filter(
      (k) => animations[k] && Object.keys(animations[k]).length > 0
    );

    if (validKeys.length === 0) {
      // Nothing real to preload — immediately ready
      setTotal(0);
      setLoaded(0);
      return;
    }

    setTotal(validKeys.length);
    let loadedCount = 0;

    validKeys.forEach((key) => {
      try {
        const anim = lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData: animations[key],
        });

        // "data_ready" fires once the animation JSON is fully parsed
        anim.addEventListener("data_ready", () => {
          loadedCount += 1;
          setLoaded(loadedCount);
        });

        instancesRef.current.push(anim);
      } catch (err) {
        // Malformed JSON — count it as "loaded" so we don't hang forever
        console.error(`[useAnimationPreloader] Failed to preload "${key}":`, err);
        loadedCount += 1;
        setLoaded(loadedCount);
      }
    });

    return () => {
      // Destroy temp instances and remove the hidden container
      instancesRef.current.forEach((a) => {
        try { a.destroy(); } catch {}
      });
      instancesRef.current = [];
      if (containerRef.current) {
        document.body.removeChild(containerRef.current);
        containerRef.current = null;
      }
    };
  }, []);

  const hasRealAnimations = total > 0;
  const isReady = !hasRealAnimations || loaded >= total;
  const progress = hasRealAnimations ? Math.round((loaded / total) * 100) : 100;

  return { isReady, progress };
}
