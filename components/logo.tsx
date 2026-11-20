import Image from "next/image";

const LOGOS = {
  /** Header lockup: mark + wordmark + divider + "software solutions". Only exists as the "web" tone. */
  nav: {
    ratio: 941.04 / 126,
    files: {
      web: "omniray-logo-web-nav",
    },
  },
  horizontal: {
    ratio: 408.03 / 126,
    files: {
      color: "omniray-logo-horizontal",
      reversed: "omniray-logo-horizontal-reversed",
      ink: "omniray-logo-horizontal-ink",
      white: "omniray-logo-horizontal-white",
      web: "omniray-logo-web-horizontal",
    },
  },
  stacked: {
    ratio: 266.53 / 232.03,
    files: {
      color: "omniray-logo-stacked",
      reversed: "omniray-logo-stacked-reversed",
      ink: "omniray-logo-stacked",
      white: "omniray-logo-stacked-reversed",
      web: "omniray-logo-web-stacked",
    },
  },
  mark: {
    ratio: 1,
    files: {
      color: "omniray-mark",
      reversed: "omniray-mark-reversed",
      ink: "omniray-mark-ink",
      white: "omniray-mark-white",
      web: "omniray-mark-web",
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
   * - "web"      white and #FF5200, for the dark site background (about #111) only.
   *              The "nav" variant exists only in this tone. The wordmark has no web
   *              file and falls back to its reversed version.
   * Note: stacked and wordmark have no one-colour files, so "ink" and "white"
   * fall back to their full-colour (or reversed) versions for those two.
   */
  tone?: "color" | "reversed" | "ink" | "white" | "web";
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
  // "nav" only has a web file, so other tones use the horizontal logo instead. Any other
  // variant without a file for the tone (the wordmark in "web") uses its reversed file.
  type Files = Partial<Record<typeof tone, string>>;
  const own = LOGOS[variant];
  const logo = variant === "nav" && !(own.files as Files)[tone] ? LOGOS.horizontal : own;
  const files = logo.files as Files;
  const file = files[tone] ?? files.reversed;

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
