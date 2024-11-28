import { forwardRef } from "react";
import Konva from "konva";
import { Transformer } from "react-konva";
import { useWindowSize } from "@/hooks/util";
import { scale } from "@/lib/util";

type PropsType = {
  disabled: boolean;
};

export const TransformLayer = forwardRef<Konva.Transformer, PropsType>(
  ({ disabled }, ref) => {
    const size = useWindowSize();
    const anchorSize = scale(size.width, 300, 1300, 28, 12);
    const anchorStrokeWidth = scale(size.width, 300, 1300, 4, 1.5);

    return (
      <Transformer
        ref={ref}
        listening={disabled}
        visible={disabled}
        keepRatio={false}
        flipEnabled={false}
        rotateEnabled={false}
        borderStroke="#8300ff"
        borderStrokeWidth={anchorStrokeWidth}
        anchorCornerRadius={100}
        anchorStrokeWidth={anchorStrokeWidth}
        anchorSize={anchorSize}
        anchorStroke="#8300ff"
        boundBoxFunc={(oldBox, newBox) => {
          if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
            return oldBox;
          }
          return newBox;
        }}
      />
    );
  },
);

TransformLayer.displayName = "TransformLayer";
