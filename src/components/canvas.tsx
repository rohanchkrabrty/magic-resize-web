"use client";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { useEffect, useRef, useState } from "react";

type Props = {};
enum CROP {
  CENTER_TOP = "center-top",
  RIGHT_TOP = "right-top",
  LEFT_MIDDLE = "left-middle",
  CENTER_MIDDLE = "center-middle",
  RIGHT_MIDDLE = "right-middle",
  LEFT_BOTTOM = "left-bottom",
  CENTER_BOTTOM = "center-bottom",
  RIGHT_BOTTOM = "right-bottom",
}

export default function Canvas({}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const konvaStageRef = useRef<Stage>();
  const [crop, setCrop] = useState<CROP>(CROP.CENTER_MIDDLE);
  const sceneWidth = 1728;
  const sceneHeight = 576;

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

  useEffect(() => {
    if (!containerRef.current) return;
    //   const Konva = (await import("konva")).default;
    const stage = new Konva.Stage({
      container: containerRef.current,
      width: sceneWidth,
      height: sceneHeight,
    });
    konvaStageRef.current = stage;

    const layer = new Konva.Layer();
    stage.add(layer);

    // function to calculate crop values from source image, its visible size and a crop strategy
    function getCrop(image, size, clipPosition = "center-middle") {
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
      if (clipPosition === "left-top") {
        x = 0;
        y = 0;
      } else if (clipPosition === "left-middle") {
        x = 0;
        y = (image.height - newHeight) / 2;
      } else if (clipPosition === "left-bottom") {
        x = 0;
        y = image.height - newHeight;
      } else if (clipPosition === "center-top") {
        x = (image.width - newWidth) / 2;
        y = 0;
      } else if (clipPosition === "center-middle") {
        x = (image.width - newWidth) / 2;
        y = (image.height - newHeight) / 2;
      } else if (clipPosition === "center-bottom") {
        x = (image.width - newWidth) / 2;
        y = image.height - newHeight;
      } else if (clipPosition === "right-top") {
        x = image.width - newWidth;
        y = 0;
      } else if (clipPosition === "right-middle") {
        x = image.width - newWidth;
        y = (image.height - newHeight) / 2;
      } else if (clipPosition === "right-bottom") {
        x = image.width - newWidth;
        y = image.height - newHeight;
      } else if (clipPosition === "scale") {
        x = 0;
        y = 0;
        newWidth = width;
        newHeight = height;
      } else {
        console.error(
          new Error("Unknown clip position property - " + clipPosition),
        );
      }

      return {
        cropX: x,
        cropY: y,
        cropWidth: newWidth,
        cropHeight: newHeight,
      };
    }

    // function to apply crop
    function applyCrop(pos) {
      const img = layer.findOne(".image");
      img.setAttr("lastCropUsed", pos);
      const crop = getCrop(
        img.image(),
        { width: img.width(), height: img.height() },
        pos,
      );
      img.setAttrs(crop);
    }

    Konva.Image.fromURL("https://konvajs.org/assets/darth-vader.jpg", img => {
      img.setAttrs({
        width: 300,
        height: 100,
        x: 80,
        y: 100,
        name: "image",
        draggable: true,
      });
      layer.add(img);
      // apply default left-top crop
      applyCrop("center-middle");

      const tr = new Konva.Transformer({
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

      layer.add(tr);

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
  return (
    <div
      className="w-full h-full flex justify-center bg-red-50 items-center overflow-hidden"
      ref={parentRef}
      onClick={() => {
        console.log("canvas clikc");
        if (!konvaStageRef.current) return;
        const layer = konvaStageRef.current.getLayers()[0];
        const img = layer.findOne(".image");
        const attrs = img?.attrs;
        const data = konvaStageRef.current?.toDataURL({
          pixelRatio: 1, // or other value you need
          x: attrs.x,
          y: attrs.y,
          width:
            attrs.x + attrs.width > sceneWidth
              ? sceneWidth - attrs.width - attrs.x
              : attrs.width,
          height:
            attrs.y + attrs.height > sceneHeight
              ? sceneHeight - attrs.height - attrs.y
              : attrs.height,
        });
        console.log(data, attrs);
      }}>
      <div ref={containerRef} className="bg-white"></div>
      {/* <select value={crop} onChange={e => setCrop(e.target.value as CROP)}>
        {Object.values(CROP).map(value => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select> */}
    </div>
  );
}
