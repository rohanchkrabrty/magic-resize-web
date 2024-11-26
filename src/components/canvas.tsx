import React, { useEffect, useRef } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";
import Konva from "konva";
import useStore from "@/hooks/useStore";
import { getImageCrop } from "@/lib/util";

const Canvas = () => {
  const { canvas, image, updateImage, isResizing } = useStore();
  const router = useRouter();

  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!image) return router.push("/");
  }, [image]);

  useEffect(() => {
    //attach transformer to image node
    if (!imageRef.current || !trRef.current || !image) return;
    trRef.current.nodes([imageRef.current]);
    applyCrop();
  }, [image]);

  useEffect(() => {
    //disable listeners if loading
    if (!imageRef.current || !trRef.current) return;

    imageRef.current.listening(!isResizing);
    trRef.current.listening(!isResizing);
  }, [isResizing]);

  function applyCrop() {
    if (!imageRef.current) return;

    const image = imageRef.current.image() as HTMLImageElement;
    if (!image) return;

    const width = imageRef.current.width();
    const height = imageRef.current.height();
    const crop = getImageCrop(image, width, height);

    imageRef.current.setAttrs(crop);
  }

  function syncCanvasData() {
    if (!imageRef.current) return;
    updateImage({
      width: Math.round(imageRef.current.width()),
      height: Math.round(imageRef.current.height()),
      x: Math.round(imageRef.current.x()),
      y: Math.round(imageRef.current.y()),
    });
  }

  return (
    <Stage
      width={canvas.width}
      height={canvas.height}
      className={cx(
        "bg-white background-dotted rounded-md shadow-sm transition-all",
        image ? "visible scale-100" : "invisible scale-90",
        isResizing && "background-pulse",
      )}>
      <Layer>
        {image && (
          <>
            <Image
              ref={imageRef}
              image={image.img}
              x={image.x}
              y={image.y}
              width={image.width}
              height={image.height}
              draggable
              strokeEnabled={false}
              shadowEnabled={false}
              fill="white"
              alt=""
              onTransform={() => {
                if (!imageRef.current) return;
                // reset scale on transform
                imageRef.current.setAttrs({
                  scaleX: 1,
                  scaleY: 1,
                  width: Math.round(
                    imageRef.current.width() * imageRef.current.scaleX(),
                  ),
                  height: Math.round(
                    imageRef.current.height() * imageRef.current.scaleY(),
                  ),
                });
                applyCrop();
              }}
              onTransformEnd={syncCanvasData}
              onDragEnd={syncCanvasData}
              onClick={e => {
                e.cancelBubble = true;
                console.log("select");
              }}
            />
            <Transformer
              ref={trRef}
              keepRatio={false}
              flipEnabled={false}
              rotateEnabled={false}
              //   borderEnabled={false}
              borderStroke="#8300ff"
              borderStrokeWidth={1.5}
              anchorCornerRadius={100}
              anchorStrokeWidth={1.5}
              anchorStroke="#8300ff"
              boundBoxFunc={(oldBox, newBox) => {
                if (
                  Math.abs(newBox.width) < 10 ||
                  Math.abs(newBox.height) < 10
                ) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;
