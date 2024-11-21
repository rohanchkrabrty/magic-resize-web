"use client";

import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import useImageStore from "./useImageStore";
import { useRouter } from "next/navigation";
import { ImageAlignment, ImageCrop } from "@/types/image";
import useCanvasStore from "./useCanvasStore";

type Props = {};

export function useCanvas({}: Props) {
  const currentImage = useImageStore(state => state.currentImage);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>();
  const konvaStageRef = useRef<Konva.Stage>();
  const [crop, setCrop] = useState<ImageCrop>(ImageCrop.CENTER_MIDDLE);
  const sceneWidth = 1024;
  const sceneHeight = 1024;
  const setAlign = useCanvasStore(state => state.setAlign);
  const setReset = useCanvasStore(state => state.setReset);

  function getImageDimensions() {
    if (!imageRef.current || !konvaStageRef.current) return;

    const img = imageRef.current;
    const stage = konvaStageRef.current;
    const originalImage = img.image() as HTMLImageElement;

    const imgWidth = originalImage.width;
    const imgHeight = originalImage.height;
    const imgRatio = imgWidth / imgHeight;

    let newWidth, newHeight;
    const stageRatio = stage.width() / stage.height();

    if (imgRatio > stageRatio) {
      newWidth = stage.width();
      newHeight = stage.width() / imgRatio;
    } else {
      newHeight = stage.height();
      newWidth = stage.height() * imgRatio;
    }

    const x = (stage.width() - newWidth) / 2;
    const y = (stage.height() - newHeight) / 2;

    return { width: newWidth, height: newHeight, x, y };
  }

  function align(alignment: ImageAlignment) {
    if (!imageRef.current || !konvaStageRef.current) return;
    console.log("ALign -> ", alignment);
    const img = imageRef.current;
    const stage = konvaStageRef.current;

    const imgWidth = img.width() * img.scaleX();
    const imgHeight = img.height() * img.scaleY();

    let { x, y } = img.getPosition();

    switch (alignment) {
      case ImageAlignment.LEFT:
        x = 0;
        break;
      case ImageAlignment.HORIZONTAL_CENTER:
        x = (stage.width() - imgWidth) / 2;
        break;
      case ImageAlignment.RIGHT:
        x = stage.width() - imgWidth;
        break;
      case ImageAlignment.TOP:
        y = 0;
        break;
      case ImageAlignment.VERTICAL_CENTER:
        y = (stage.height() - imgHeight) / 2;
        break;
      case ImageAlignment.BOTTOM:
        y = stage.height() - imgHeight;
        break;
    }

    img.position({ x, y });
  }

  function fitStageIntoParentContainer() {
    console.log("canvas resized");
    if (!konvaStageRef.current || !parentRef.current || !containerRef.current)
      return;

    // now we need to fit stage into parent container
    const containerWidth = parentRef.current.offsetWidth;
    const containerHeight = parentRef.current.offsetHeight;
    const canvasSize = Math.min(containerHeight, containerWidth);
    // console.log({ canvasSize, containerHeight, containerWidth });

    // but we also make the full scene visible
    // so we need to scale all objects on canvas
    const scale = canvasSize / sceneWidth;

    // containerRef.current.style.transform = `scale(${scale})`;

    konvaStageRef.current.width(sceneWidth * scale);
    konvaStageRef.current.height(sceneHeight * scale);
    konvaStageRef.current.scale({ x: scale, y: scale });
  }
  // function to calculate crop values from source image, its visible size and a crop strategy
  function getCrop(image, size, cropPosition = ImageCrop.CENTER_BOTTOM) {
    const width = size.width;
    const height = size.height;
    const aspectRatio = width / height;

    let newWidth;
    let newHeight;

    const imageRatio = image.width / image.height;

    if (aspectRatio >= imageRatio) {
      newWidth = image.width;
      newHeight = image.width / aspectRatio;
    } else {
      newWidth = image.height * aspectRatio;
      newHeight = image.height;
    }

    let x = 0;
    let y = 0;
    if (cropPosition === "left-top") {
      x = 0;
      y = 0;
    } else if (cropPosition === "left-middle") {
      x = 0;
      y = (image.height - newHeight) / 2;
    } else if (cropPosition === "left-bottom") {
      x = 0;
      y = image.height - newHeight;
    } else if (cropPosition === "center-top") {
      x = (image.width - newWidth) / 2;
      y = 0;
    } else if (cropPosition === "center-middle") {
      x = (image.width - newWidth) / 2;
      y = (image.height - newHeight) / 2;
    } else if (cropPosition === "center-bottom") {
      x = (image.width - newWidth) / 2;
      y = image.height - newHeight;
    } else if (cropPosition === "right-top") {
      x = image.width - newWidth;
      y = 0;
    } else if (cropPosition === "right-middle") {
      x = image.width - newWidth;
      y = (image.height - newHeight) / 2;
    } else if (cropPosition === "right-bottom") {
      x = image.width - newWidth;
      y = image.height - newHeight;
    } else if (cropPosition === "scale") {
      x = 0;
      y = 0;
      newWidth = width;
      newHeight = height;
    } else {
      console.error(
        new Error("Unknown clip position property - " + cropPosition),
      );
    }

    return {
      cropX: x,
      cropY: y,
      cropWidth: newWidth,
      cropHeight: newHeight,
    };
  }

  function applyCrop(cropPosition: ImageCrop) {
    if (!imageRef.current) return;
    imageRef.current.setAttr("lastCropUsed", cropPosition);

    const crop = getCrop(
      imageRef.current.image(),
      {
        width: imageRef.current.width(),
        height: imageRef.current.height(),
      },
      cropPosition,
    );
    imageRef.current.setAttrs(crop);
  }

  function reset() {
    if (!imageRef.current || !konvaStageRef.current) return;
    console.log("reset");
    const img = imageRef.current;

    const config = getImageDimensions();
    if (config) {
      img.position({ x: config.x, y: config.y });
      img.width(config.width);
      img.height(config.height);
      applyCrop(ImageCrop.CENTER_MIDDLE);
    }

    // img.getLayer()?.batchDraw();
  }

  useEffect(() => {
    if (!currentImage?.src) return router.push("/");

    if (!containerRef.current) return;
    //   const Konva = (await import("konva")).default;

    // const image = new Image()
    // image.src =

    const stage = new Konva.Stage({
      container: containerRef.current,
      width: sceneWidth,
      height: sceneHeight,
    });
    konvaStageRef.current = stage;

    const layer = new Konva.Layer();
    stage.add(layer);

    Konva.Image.fromURL(currentImage.src, img => {
      imageRef.current = img;
      console.log("img => ", img);

      const config = getImageDimensions();

      img.setAttrs({
        ...config,
        name: "image",
        draggable: true,
        // fill: "white",
        shadowEnabled: false,
        strokeEnabled: false,
      });
      layer.add(img);
      applyCrop(ImageCrop.CENTER_MIDDLE);

      const transform = new Konva.Transformer({
        nodes: [img],
        keepRatio: false,
        flipEnabled: false,
        rotateEnabled: false,
        boundBoxFunc: (oldBox, newBox) => {
          if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
            return oldBox;
          }
          return newBox;
        },
      });

      layer.add(transform);

      img.on("transform", () => {
        // reset scale on transform
        img.setAttrs({
          scaleX: 1,
          scaleY: 1,
          width: img.width() * img.scaleX(),
          height: img.height() * img.scaleY(),
        });
        applyCrop(img.getAttr("lastCropUsed"));
      });
      setIsLoading(false);
    });

    // document.querySelector("#clip").onchange = e => {
    //   applyCrop(e.target.value);
    // };
    fitStageIntoParentContainer();

    window.addEventListener("resize", fitStageIntoParentContainer);
    return () => {
      window.removeEventListener("resize", fitStageIntoParentContainer);
    };
  }, []);

  useEffect(() => {
    setAlign(align);
    setReset(reset);
  }, [align, reset]);

  return { parentRef, containerRef, isLoading, align, reset };
}
