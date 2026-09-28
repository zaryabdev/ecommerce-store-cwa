import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  return (
    <button
      type={type}
      className={cn(
        `
        inline-flex
        w-auto
        min-h-[44px]
        items-center
        justify-center
        gap-2
        rounded-full
        border
        border-transparent
        bg-primary
        px-5
        py-2.5
        text-body
        font-semibold
        text-primary-foreground
        transition
        hover:opacity-90
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-focus
        disabled:cursor-not-allowed
        disabled:opacity-50
      `,
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
