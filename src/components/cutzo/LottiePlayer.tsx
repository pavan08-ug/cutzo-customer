/**
 * LottiePlayer
 * ────────────
 * Drop-in component that renders a locally-bundled Lottie animation.
 * All data comes from the statically-imported registry — no network ever.
 *
 * Basic usage:
 *   <LottiePlayer animationKey="bookingSuccess" style={{ width: 200, height: 200 }} />
 *
 * With controls:
 *   <LottiePlayer
 *     animationKey="splashLoop"
 *     loop={false}
 *     autoplay
 *     onComplete={() => console.log("done!")}
 *     style={{ width: 160, height: 160 }}
 *     className="mx-auto"
 *   />
 */

import React from "react";
import { useLottieAnimation } from "@/hooks/useLottieAnimation";
import { AnimationKey } from "@/assets/animations";

interface LottiePlayerProps {
  animationKey: AnimationKey;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onComplete?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function LottiePlayer({
  animationKey,
  loop = true,
  autoplay = true,
  speed = 1,
  onComplete,
  style,
  className,
}: LottiePlayerProps) {
  const { ref } = useLottieAnimation(animationKey, {
    loop,
    autoplay,
    speed,
    onComplete,
  });

  return (
    <div
      ref={ref}
      style={style}
      className={className}
      aria-hidden="true"   // decorative — screen readers skip it
    />
  );
}

export default LottiePlayer;
