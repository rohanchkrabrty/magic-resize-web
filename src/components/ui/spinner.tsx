import React, { HTMLAttributes } from "react";
import { cva, cx, VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  [
    "inline-block border-2 rounded-full border-solid border-transparent animate-spin [animation-duration:_.6s]",
  ],
  {
    variants: {
      theme: {
        white: "border-t-white border-r-white",
        gray: "border-t-gray-400 border-r-grayborder-t-gray-400",
      },
      size: {
        small: "w-4 h-4",
        large: "w-6 h-6",
      },
    },
    defaultVariants: {
      theme: "white",
      size: "small",
    },
  },
);

type SpinnerProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof spinnerVariants>;

export function Spinner({ className, theme, size, ...props }: SpinnerProps) {
  return (
    <span
      className={cx(spinnerVariants({ theme, size, className }))}
      {...props}
    />
  );
}
