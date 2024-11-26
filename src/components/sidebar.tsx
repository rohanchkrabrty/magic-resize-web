import React, { useState } from "react";
import { Button } from "./ui";
import { Logo } from "./logo";
import {
  AlignBottomSimple,
  AlignLeftSimple,
  AlignRightSimple,
  AlignCenterHorizontalSimple,
  AlignTopSimple,
  AlignCenterVerticalSimple,
  ArrowCounterClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { cx } from "class-variance-authority";
import { Icon } from "@phosphor-icons/react";
import { ImageAlignment } from "@/types/image";
import Select from "./ui/select";
import { usePresets, useResize } from "@/hooks/queries";
import { Preset } from "@/types/api";
import useStore from "@/hooks/useStore";
import { cropImage, downloadImage, loadImage } from "@/lib/util";
import { Tooltip, TooltipProvider } from "./ui/tootlip";

type ActionType =
  | {
      icon: Icon;
      action: "align";
      align: ImageAlignment;
      label: string;
    }
  | {
      icon: Icon;
      action: "reset";
      align: undefined;
      label: string;
    };
const ActionButtons: ActionType[][] = [
  [
    {
      icon: AlignLeftSimple,
      action: "align",
      align: ImageAlignment.LEFT,
      label: "Align Left",
    },
    {
      icon: AlignCenterHorizontalSimple,
      action: "align",
      align: ImageAlignment.HORIZONTAL_CENTER,
      label: "Align Horizontal Centers",
    },
    {
      icon: AlignRightSimple,
      action: "align",
      align: ImageAlignment.RIGHT,
      label: "Align Right",
    },
  ],
  [
    {
      icon: AlignTopSimple,
      action: "align",
      align: ImageAlignment.TOP,
      label: "Align Top",
    },
    {
      icon: AlignCenterVerticalSimple,
      action: "align",
      align: ImageAlignment.VERTICAL_CENTER,
      label: "Align Vertical Centers",
    },
    {
      icon: AlignBottomSimple,
      action: "align",
      align: ImageAlignment.BOTTOM,
      label: "Align Bottom",
    },
  ],
  [
    {
      icon: ArrowCounterClockwise,
      action: "reset",
      align: undefined,
      label: "Reset Position",
    },
  ],
];
const defaultPreset: Preset = {
  name: "Square",
  aspect_ratio_label: "1:1",
  aspect_ratio: 1,
  width: 1024,
  height: 1024,
  icon_url: "",
};
export default function Sidebar() {
  const {
    updateCanvas,
    alignImage,
    resetImage,
    setImage,
    canvas,
    image,
    originalImage,
    isResizing,
    setIsResizing,
    resetImageToOriginal,
  } = useStore();
  const [selectedpreset, setSelectedPreset] = useState<Preset>(defaultPreset);
  const presets = usePresets([defaultPreset]);
  const resize = useResize();
  const isImageResizing = resize.loading || isResizing;

  const cannotResizeImage =
    canvas.width === image?.width &&
    canvas.height === image.height &&
    image.x === 0 &&
    image.y === 0;

  const canRegenerate = cannotResizeImage && originalImage?.id !== image.id;
  console.log(selectedpreset);

  return (
    <div className="h-full flex-[300px] flex-shrink-0 margin-10 bg-white shadow-sm rounded-3xl flex flex-col px-6 pb-7 pt-6 gap-8">
      <Logo />
      <div>
        <p className="uppercase text-[11px] font-semibold text-gray-500 mb-3">
          Position
        </p>
        <div className="flex gap-2 self-stretch justify-between">
          <TooltipProvider>
            {ActionButtons.map((buttons, rowIndex) => (
              <div className="flex" key={rowIndex}>
                {buttons.map(
                  ({ icon: Icon, action, align, label }, colIndex) => (
                    <Tooltip key={colIndex} content={label} align="center">
                      <Button
                        size="icon"
                        disabled={isImageResizing}
                        variant="secondary"
                        onClick={() => {
                          if (action === "align" && align)
                            return alignImage(align);
                          return resetImage();
                        }}
                        className={cx(
                          "p-1 w-8 h-8 focus-visible:z-10 focus-visible:ring-offset-0",
                          "rounded-l-none rounded-r-none",
                          colIndex === 0 && "!rounded-l-lg border-r-0",
                          colIndex === buttons.length - 1 &&
                            "!rounded-r-lg border-l-0",
                          buttons.length === 1 && "border-l border-r",
                        )}>
                        <Icon />
                      </Button>
                    </Tooltip>
                  ),
                )}
              </div>
            ))}
          </TooltipProvider>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="uppercase text-[11px] font-semibold text-gray-500 mb-3">
          Preset
        </p>
        <Select<Preset>
          options={presets.data.map((preset: Preset) => ({
            value: preset.name,
            ...preset,
          }))}
          onValueChange={value => {
            updateCanvas({ width: value.width, height: value.height });
            setSelectedPreset(value);
          }}
          defaultValue={{ ...defaultPreset, value: defaultPreset.name }}
          placeholder="Select a preset"
          className="rounded-b-none z-10"
          isLoading={presets.loading}
          disabled={isImageResizing}
        />
        <div className="flex gap-2 text-sm self-stretch justify-between text-gray-500 font-medium p-1.5 px-3 bg-gray-50 border border-gray-200 rounded-b-md border-t-0">
          <p>W {selectedpreset.width}px</p>
          <p>H {selectedpreset.height}px</p>
          <p>AR {selectedpreset.aspect_ratio_label}</p>
        </div>
      </div>
      <div className="border-b border-gray-200" />
      <div className="flex flex-col self-stretch gap-4">
        <Button
          disabled={!canRegenerate && cannotResizeImage}
          isLoading={isImageResizing}
          onClick={() => {
            setIsResizing(true);
            const imageToUse = canRegenerate ? originalImage : image;
            if (!imageToUse) return;

            const data = cropImage(
              imageToUse.img,
              imageToUse.width,
              imageToUse.height,
            );

            resize
              .execute({
                image: data,
                left: String(Math.round(imageToUse.x)),
                right: String(
                  canvas.width - Math.round(imageToUse.x) - imageToUse.width,
                ),
                top: String(Math.round(imageToUse.y)),
                bottom: String(
                  canvas.height - Math.round(imageToUse.y) - imageToUse.height,
                ),
              })
              .then(url => {
                if (!url) return;

                loadImage(url).then(data => {
                  setImage(data);
                  setIsResizing(false);
                });
              });
          }}>
          {canRegenerate ? "Regenerate" : "Resize"}
        </Button>
        {canRegenerate && (
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              onClick={resetImageToOriginal}
              className="flex-1">
              Reset to default
            </Button>
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => {
                console.log("downloading image", image.img);
                console.log("imaeg -> ", image.src);
                downloadImage(image.src);
              }}>
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
