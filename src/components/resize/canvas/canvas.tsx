import React, { useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { cx } from "class-variance-authority";
import { useStore } from "@/hooks/store";
import { ImageLayer } from "./image-layer";

export const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const image = useStore(state => state.image);
  const canvas = useStore(state => state.canvas);
  const isResizing = useStore(state => state.isResizing);

  const resizeCanvas = () => {
    const parent = canvasRef.current?.parentElement;

    if (!parent || !canvasRef.current) return;

    const baseWidth = canvas.width;
    const baseHeight = canvas.height;

    const scaleX = parent.clientWidth / baseWidth;
    const scaleY = parent.clientHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    canvasRef.current.style.transform = `scale(${scale})`;
    canvasRef.current.style.width = `${baseWidth}px`;
    canvasRef.current.style.height = `${baseHeight}px`;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvas]);

  return (
    <div ref={canvasRef} className="origin-center scale-in">
      <Stage
        width={canvas.width}
        height={canvas.height}
        className={cx(
          "bg-white background-dotted rounded-md shadow-sm transition-all",
          isResizing && "background-pulse",
        )}>
        <Layer>
          <ImageLayer />
        </Layer>
      </Stage>
    </div>
  );
};
