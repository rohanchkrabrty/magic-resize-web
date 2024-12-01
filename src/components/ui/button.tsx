import { cva, cx, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#df00ff] to-[#8300ff] text-white font-semibold hover:opacity-80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-gray-100 border border-gray-200 text-gray-800 hover:opacity-80",
      },
      size: {
        default: "h-10 px-4 py-2 sm:py-1 sm:px-3 sm:h-9",
        sm: "h-9 rounded-md px-3 sm:px-2 sm:py-1 sm:h-8",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cx(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading ? true : disabled}
        {...props}>
        {children}
        {isLoading && <Spinner />}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
