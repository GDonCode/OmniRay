import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

type CommonProps = {
  /** primary = coral accent, secondary = deep blue. */
  variant?: Variant;
  /** Icon shown beside the label; it glides to the centre on hover. */
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type AnchorProps = CommonProps &
  Omit<ComponentProps<"a">, keyof CommonProps> & { href: string };
type NativeButtonProps = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

export type ButtonProps = AnchorProps | NativeButtonProps;

export function PlayIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z"
      />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 5.5v16M8 7h8"
      />
    </svg>
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", icon, children, className, ...rest } = props;
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");
  const content = (
    <>
      {icon}
      <span className="btn-text">{children}</span>
    </>
  );

  if (props.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof CommonProps>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as Omit<NativeButtonProps, keyof CommonProps>;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
