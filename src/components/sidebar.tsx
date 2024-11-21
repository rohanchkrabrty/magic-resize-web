import React, { useEffect, useState } from "react";
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
import useCanvasStore from "@/hooks/useCanvasStore";
import { usePresets } from "@/hooks/queries";
import { Preset } from "@/types/api";

type Props = {};
type ActionType =
  | {
      icon: Icon;
      action: "align";
      align: ImageAlignment;
    }
  | {
      icon: Icon;
      action: "reset";
      align: undefined;
    };
const ActionButtons: ActionType[][] = [
  [
    {
      icon: AlignLeftSimple,
      action: "align",
      align: ImageAlignment.LEFT,
    },
    {
      icon: AlignCenterHorizontalSimple,
      action: "align",
      align: ImageAlignment.HORIZONTAL_CENTER,
    },
    {
      icon: AlignRightSimple,
      action: "align",
      align: ImageAlignment.RIGHT,
    },
  ],
  [
    {
      icon: AlignTopSimple,
      action: "align",
      align: ImageAlignment.TOP,
    },
    {
      icon: AlignCenterVerticalSimple,
      action: "align",
      align: ImageAlignment.VERTICAL_CENTER,
    },
    {
      icon: AlignBottomSimple,
      action: "align",
      align: ImageAlignment.BOTTOM,
    },
  ],
  [
    {
      icon: ArrowCounterClockwise,
      action: "reset",
      align: undefined,
    },
  ],
];
const defaultPreset = {
  name: "Square",
  aspect_ratio_label: "1:1",
  aspect_ratio: 1,
  width: 1024,
  height: 1024,
  icon_url: "",
};
export default function Sidebar({}: Props) {
  const alignCanvas = useCanvasStore(state => state.align);
  const resetCanvas = useCanvasStore(state => state.reset);
  const [selectedpreset, setSelectedPreset] = useState<Preset>(defaultPreset);
  const { data, loading } = usePresets();

  return (
    <div className="h-full flex-[300px] flex-shrink-0 margin-10 bg-white shadow-sm rounded-3xl flex flex-col px-6 pb-7 pt-6 gap-8">
      <Logo />
      <div>
        <p className="uppercase text-[11px] font-semibold text-gray-500 mb-3">
          Position
        </p>
        <div className="flex gap-2 self-stretch justify-between">
          {ActionButtons.map((buttons, rowIndex) => (
            <div className="flex" key={rowIndex}>
              {buttons.map(({ icon: Icon, action, align }, colIndex) => (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => {
                    if (action === "align" && align)
                      return alignCanvas?.(align);
                    return resetCanvas?.();
                  }}
                  className={cx(
                    "p-1 w-8 h-8 focus-visible:z-10 focus-visible:ring-offset-0",
                    "rounded-l-none rounded-r-none",
                    colIndex === 0 && "!rounded-l-lg border-r-0",
                    colIndex === buttons.length - 1 &&
                      "!rounded-r-lg border-l-0",
                    buttons.length === 1 && "border-l border-r",
                  )}
                  key={colIndex}>
                  <Icon />
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <p className="uppercase text-[11px] font-semibold text-gray-500 mb-3">
          Preset
        </p>
        <Select
          options={(data ?? []).map((preset: Preset) => ({
            label: preset.name,
            value: preset,
          }))}
          onValueChange={setSelectedPreset}
          placeholder="Select a preset"
          className="rounded-b-none z-10"
        />
        <div className="flex gap-2 text-sm self-stretch justify-between text-gray-500 font-medium p-1.5 px-3 bg-gray-50 border border-gray-200 rounded-b-md border-t-0">
          {/* [&_p]:border [&_p]:px-2 [&_p]:py-1 [&_p]:border-gray-200 [&_p]:rounded-md [&_p]:bg-gray-50 */}
          <p>W {selectedpreset.width}px</p>
          <p>H {selectedpreset.height}px</p>
          <p>AR {selectedpreset.aspect_ratio_label}</p>
        </div>
      </div>
      {/* <div className="border-b border-gray-200" /> */}
      <Button>Resize</Button>
    </div>
  );
}
