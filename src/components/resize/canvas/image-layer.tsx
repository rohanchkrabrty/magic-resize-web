import { useEffect, useRef } from "react";
import Konva from "konva";
import { Image, Transformer } from "react-konva";
import { useStore } from "@/hooks/store";
import { getImageCrop } from "@/lib/util";

export function ImageLayer() {
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const image = useStore(state => state.image);
  const updateImage = useStore(state => state.updateImage);
  const isResizing = useStore(state => state.isResizing);

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

  useEffect(() => {
    //attach transformer to image node
    if (!imageRef.current || !trRef.current || !image?.src) return;
    trRef.current.nodes([imageRef.current]);
    applyCrop();
  }, [image?.src]);

  if (!image) return null;
  return (
    <>
      <Image
        ref={imageRef}
        image={image.img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        draggable
        listening={!isResizing}
        strokeEnabled={false}
        shadowEnabled={false}
        fill="white"
        alt=""
        onTransform={() => {
          if (!imageRef.current) return;
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
        listening={!isResizing}
        visible={!isResizing}
        keepRatio={false}
        flipEnabled={false}
        rotateEnabled={false}
        borderStroke="#8300ff"
        borderStrokeWidth={1.5}
        anchorCornerRadius={100}
        anchorStrokeWidth={1.5}
        anchorStroke="#8300ff"
        boundBoxFunc={(oldBox, newBox) => {
          if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
}
