import { cx } from "class-variance-authority";
import { Icon } from "@phosphor-icons/react";
import {
  AlignBottomSimple,
  AlignLeftSimple,
  AlignRightSimple,
  AlignCenterHorizontalSimple,
  AlignTopSimple,
  AlignCenterVerticalSimple,
  ArrowCounterClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { useStore } from "@/hooks/store";
import { Button, Tooltip, TooltipProvider } from "@/components/ui";
import { ImageAlignment } from "@/types/image";

export type ActionType =
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

type PropsType = {
  disabled?: boolean;
};

export const ActionButtons: ActionType[][] = [
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

export function PositionActions({ disabled = false }: PropsType) {
  const alignImage = useStore(state => state.alignImage);
  const resetImage = useStore(state => state.resetImage);

  return (
    <div>
      <p className="uppercase text-[11px] font-semibold text-gray-500 mb-3">
        Position
      </p>
      <div className="flex gap-2 self-stretch justify-between">
        <TooltipProvider>
          {ActionButtons.map((buttons, rowIndex) => (
            <div className="flex" key={rowIndex}>
              {buttons.map(({ icon: Icon, action, align, label }, colIndex) => (
                <Tooltip key={colIndex} content={label} align="center">
                  <Button
                    size="icon"
                    disabled={disabled}
                    variant="secondary"
                    onClick={() => {
                      if (action === "align" && align) return alignImage(align);
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
              ))}
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
