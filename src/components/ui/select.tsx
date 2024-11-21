"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cx } from "class-variance-authority";

type SelectProps = {
  options: { label: string; value: any }[];
  onValueChange: (value: any) => void;
  defaultValue?: any;
  placeholder?: string;
  className?: string;
};

const Select = ({
  options,
  onValueChange,
  defaultValue,
  placeholder,
  className,
}: SelectProps) => {
  return (
    <SelectPrimitive.Root
      onValueChange={onValueChange}
      defaultValue={defaultValue}>
      <SelectPrimitive.Trigger
        className={cx(
          "flex text-gray-900 h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cx(
            "w-full relative z-50 max-h-96 overflow-auto rounded-md border bg-white text-gray-900 shadow-md",
          )}>
          <SelectPrimitive.Viewport className="p-1">
            {options.map(({ label, value }) => (
              <SelectPrimitive.Item
                key={label}
                value={value}
                className={cx(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                )}>
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator></SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

export default Select;
