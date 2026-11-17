import Image from "next/image";

const LOGOS = {
  horizontal: {
    ratio: 408.03 / 126,
    files: {
      color: "omniray-logo-horizontal",
      reversed: "omniray-logo-horizontal-reversed",
      ink: "omniray-logo-horizontal-ink",
      white: "omniray-logo-horizontal-white",
    },
  },
  stacked: {
    ratio: 266.53 / 232.03,
    files: {
      color: "omniray-logo-stacked",
      reversed: "omniray-logo-stacked-reversed",
      ink: "omniray-logo-stacked",
      white: "omniray-logo-stacked-reversed",
    },
  },
  mark: {
    ratio: 1,
    files: {
      color: "omniray-mark",
      reversed: "omniray-mark-reversed",
      ink: "omniray-mark-ink",
      white: "omniray-mark-white",
    },
  },
  wordmark: {
    ratio: 254.53 / 64.16,
    files: {
      color: "omniray-wordmark",
      reversed: "omniray-wordmark-reversed",
      ink: "omniray-wordmark",
      white: "omniray-wordmark-reversed",
    },
  },
} as const;

type LogoProps = {
  /** Which lockup to show. */
  variant?: keyof typeof LOGOS;
  /**
   * Which colour version to use:
   * - "color"    full colour, for white and paper backgrounds (default)
   * - "reversed" full colour, for deep green (ink) backgrounds
   * - "ink"      one colour (deep green), for orange, yellow and mint backgrounds
   * - "white"    one colour (white), for photos and busy images
   * Note: stacked and wordmark have no one-colour files, so "ink" and "white"
   * fall back to their full-colour (or reversed) versions for those two.
   */
  tone?: "color" | "reversed" | "ink" | "white";
  /** Rendered height in px. Width follows the logo's proportions. */
  height?: number;
  /** Set on the header logo so it loads first. */
  priority?: boolean;
  alt?: string;
  className?: string;
};

export function Logo({
  variant = "horizontal",
  tone = "color",
  height = 40,
  priority = false,
  alt = "OmniRay",
  className,
}: LogoProps) {
  const logo = LOGOS[variant];
  const file = logo.files[tone];

  return (
    <Image
      src={`/brand/svg/${file}.svg`}
      alt={alt}
      width={Math.round(height * logo.ratio)}
      height={height}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
