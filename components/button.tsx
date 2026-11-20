import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

type CommonProps = {
  /** primary = orange accent (ink text), secondary = ink. */
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

export function Button(props: ButtonProps) {
  const { variant = "primary", icon, children, className, ...rest } = props;
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");
  const content = (
    <>
      {icon && (
        <span className="btn-icon" aria-hidden>
          {icon}
        </span>
      )}
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
