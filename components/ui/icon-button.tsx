import { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
  /**
   * Required. IconButton renders no visible text, so every instance needs an
   * explicit accessible name for screen readers (previously missing — see
   * Storefront audit, Section 15/19).
   */
  "aria-label": string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className,
  "aria-label": ariaLabel,
  disabled,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition hover:scale-110 hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
        className
      )}
    >
      {icon}
    </button>
   );
}

export default IconButton;
