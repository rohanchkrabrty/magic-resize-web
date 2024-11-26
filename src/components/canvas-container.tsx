import React, { useRef, useEffect, useState } from "react";
import Canvas from "./canvas";

const CanvasContainer = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const canvasSize = { width: 1000, height: 1000 }; // Fixed canvas size

  useEffect(() => {
    const updateScale = () => {
      if (canvasRef.current) {
        const { width: containerWidth, height: containerHeight } =
          canvasRef.current.getBoundingClientRect();

        const scaleX = containerWidth / canvasSize.width;
        const scaleY = containerHeight / canvasSize.height;
        const newScale = Math.min(scaleX, scaleY); // Maintain aspect ratio

        setScale(newScale);
      }
    };

    // updateScale();
    // window.addEventListener("resize", updateScale);

    // return () => {
    //   window.removeEventListener("resize", updateScale);
    // };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full flex justify-center items-center relative">
      <Canvas />
    </div>
  );
};

export default CanvasContainer;
