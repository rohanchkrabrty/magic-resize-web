import { ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cx } from "class-variance-authority";

interface TooltipProps
  extends Omit<TooltipPrimitive.TooltipContentProps, "content"> {
  content: ReactNode;
}

export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({
  children,
  content,
  align = "start",
  side = "top",
  className,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          className={cx(
            "z-[90] bg-gray-800 text-white text-[13px] leading-4 tracking-normal rounded-md outline-none p-2 border-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}>
          {content}
          <TooltipPrimitive.Arrow
            width={12}
            height={6}
            className="fill-gray-800"
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
