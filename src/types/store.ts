import { ImageAlignment } from "./image";

export type SizeType = {
  width: number;
  height: number;
};

export type PositionType = {
  x: number;
  y: number;
};

export type CanvasType = SizeType;

export type ImageType = SizeType &
  PositionType & {
    originalWidth: number;
    originalHeight: number;
    src: string;
    img: HTMLImageElement;
    id: string;
  };

export type StoreType = {
  isResizing: boolean;
  setIsResizing: (status: boolean) => void;
  canvas: CanvasType;
  updateCanvas: (canvas: CanvasType) => void;
  image: ImageType | null;
  originalImage: ImageType | null;
  updateImage: (image: SizeType | PositionType) => void;
  setImage: (image: HTMLImageElement, forceReset?: boolean) => void;
  alignImage: (alignment: ImageAlignment) => void;
  resetImage: () => void;
  resetImageToOriginal: () => void;
};
