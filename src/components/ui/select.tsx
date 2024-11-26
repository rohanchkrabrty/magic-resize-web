"use client";

import { ReactNode } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cx } from "class-variance-authority";
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";
import { Spinner } from "./spinner";

type SelectPropsType<T> = {
  options: (T & { value: string })[];
  onValueChange: (value: T & { value: string }) => void;
  defaultValue?: T & { value: string };
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  item?: (value: T & { value: string }) => ReactNode;
};

export const Select = <T,>({
  options,
  onValueChange,
  defaultValue,
  placeholder,
  className,
  isLoading = false,
  disabled = false,
  item = ({ value }) => value,
}: SelectPropsType<T>) => {
  return (
    <SelectPrimitive.Root
      disabled={isLoading || disabled}
      onValueChange={value => {
        const selectedValue = options.find(option => option.value === value);
        if (selectedValue) onValueChange(selectedValue);
      }}
      defaultValue={defaultValue?.value}>
      <SelectPrimitive.Trigger
        className={cx(
          "flex text-gray-900 h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          {isLoading ? <Spinner theme="gray" /> : <CaretDown />}
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          side="bottom"
          sideOffset={0}
          className={cx(
            "relative z-50 h-[400px] overflow-auto rounded-md border bg-white text-gray-900 shadow-md w-[var(--radix-select-trigger-width)] rounded-t-none",
          )}>
          <SelectPrimitive.Viewport className="p-1">
            {options.map(option => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cx(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                )}>
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check />
                  </SelectPrimitive.ItemIndicator>
                </span>
                {/* <SelectPrimitive.ItemText asChild> */}
                {item(option)}
                {/* </SelectPrimitive.ItemText> */}
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};
