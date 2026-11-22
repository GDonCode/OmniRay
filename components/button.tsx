import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

type CommonProps = {
  /** primary = orange accent (ink text), secondary = ink. */
  variant?: Variant;
  /** Icon shown beside the label. On hover a multi-word string label folds down to its first word. */
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
  // With an icon, a multi-word label folds to its first word on hover: "Start a project" -> [icon] Start.
  // The button keeps its full width: an invisible copy of the whole label (the sizer) sets the width,
  // and the live content stays centred in it as the extra words fold away.
  const words = typeof children === "string" && icon ? children.match(/^(\S+)(\s[\s\S]+)$/) : null;
  const content = (
    <>
      {words && (
        <span className="btn-sizer" aria-hidden>
          <span className="btn-icon" />
          <span className="btn-text">{children}</span>
        </span>
      )}
      <span className="btn-live">
        {icon && (
          <span className="btn-icon" aria-hidden>
            {icon}
          </span>
        )}
        <span className="btn-text">
          {words ? (
            <>
              {words[1]}
              <span className="btn-rest">
                <span>{words[2]}</span>
              </span>
            </>
          ) : (
            children
          )}
        </span>
      </span>
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
