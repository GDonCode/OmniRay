import Image from "next/image";

const LOGOS = {
  horizontal: {
    ratio: 408.03 / 126,
    light: "omniray-logo-horizontal",
    dark: "omniray-logo-horizontal-reversed",
  },
  stacked: {
    ratio: 266.53 / 232.03,
    light: "omniray-logo-stacked",
    dark: "omniray-logo-stacked-reversed",
  },
  mark: {
    ratio: 1,
    light: "omniray-mark",
    dark: "omniray-mark-reversed",
  },
  wordmark: {
    ratio: 254.53 / 64.16,
    light: "omniray-wordmark",
    dark: "omniray-wordmark-reversed",
  },
} as const;

type LogoProps = {
  /** Which lockup to show. */
  variant?: keyof typeof LOGOS;
  /** The background the logo sits on: "light" uses the blue version, "dark" the reversed one. */
  on?: "light" | "dark";
  /** Rendered height in px. Width follows the logo's proportions. */
  height?: number;
  /** Set on the header logo so it loads first. */
  priority?: boolean;
  alt?: string;
  className?: string;
};

export function Logo({
  variant = "horizontal",
  on = "light",
  height = 40,
  priority = false,
  alt = "OmniRay",
  className,
}: LogoProps) {
  const logo = LOGOS[variant];
  const file = on === "dark" ? logo.dark : logo.light;

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
