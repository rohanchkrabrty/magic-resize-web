"use client";

import { cx } from "class-variance-authority";
import { DragEvent, useId } from "react";
import { Image } from "@phosphor-icons/react/dist/ssr";

type Props = {
  onChange?: (file: File) => void;
};

export function ImageUpload({ onChange = () => {} }: Props) {
  const inputId = useId();

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
        tabIndex={0}
        className={cx(
          "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50",
          "hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        )}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Image size={32} alt="" className="text-gray-400" />
          <p className="mt-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG or WEBP
          </p>
        </div>
        <input
          id={inputId}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
