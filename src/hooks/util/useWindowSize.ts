import { SizeType } from "@/types/store";
import { useLayoutEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState<SizeType>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}
