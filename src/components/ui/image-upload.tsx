"use client";

import { DragEvent, useId } from "react";
import { cx } from "class-variance-authority";
import { Image } from "@phosphor-icons/react/dist/ssr";
import { Spinner } from "./spinner";

type Props = {
  onChange?: (file: File) => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export function ImageUpload({
  onChange = () => {},
  disabled = false,
  isLoading = false,
}: Props) {
  const inputId = useId();
  const isDisabled = disabled || isLoading;

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      onChange(files[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      onChange(files[0]);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor={inputId}
        tabIndex={isDisabled ? -1 : 0}
        className={cx(
          "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50",
          isDisabled
            ? "cursor-not-allowed opacity-80"
            : "hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        )}
        onKeyDown={!isDisabled ? handleKeyDown : undefined}
        onDrop={!isDisabled ? handleDrop : undefined}
        onDragOver={!isDisabled ? handleDragOver : undefined}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isLoading ? (
            <>
              <Spinner size="large" theme="gray" />
              <p className="mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                Loading image
              </p>
            </>
          ) : (
            <>
              <Image size={32} alt="" className="text-gray-400" />
              <p className="mt-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG or WEBP
              </p>
            </>
          )}
        </div>
        <input
          id={inputId}
          disabled={isDisabled}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
