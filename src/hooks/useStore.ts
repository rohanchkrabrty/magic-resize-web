import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ImageAlignment } from "@/types/image";
import { ImageType, StoreType } from "@/types/store";
import { getDefaultImageDimension } from "@/lib/util";

const useStore = create(
  devtools<StoreType>(
    set => ({
      canvas: { width: 1024, height: 1024 },
      image: null,
      originalImage: null,
      isResizing: false,
      setIsResizing: status => set({ isResizing: status }),
      updateCanvas: data =>
        set(state => {
          const { image } = state;

          if (!image) return { canvas: data };

          return {
            canvas: data,
            image: {
              ...image,
              ...getDefaultImageDimension(
                image.width,
                image.height,
                data.width,
                data.height,
              ),
            },
          };
        }),

      updateImage: data =>
        set(state => {
          const { image } = state;
          if (!image) return state;

          return { image: { ...image, ...data } };
        }),
      resetImage: () =>
        set(state => {
          const { image, canvas } = state;
          if (!image) return state;

          return {
            image: {
              ...image,
              ...getDefaultImageDimension(
                image.originalWidth,
                image.originalHeight,
                canvas.width,
                canvas.height,
              ),
            },
          };
        }),
      resetImageToOriginal: () =>
        set(state => {
          const { originalImage } = state;
          if (!originalImage) return state;

          return {
            image: originalImage,
          };
        }),
      setImage: img =>
        set(state => {
          const { canvas, originalImage, image } = state;

          const data: ImageType = {
            id: crypto.randomUUID(),
            img: img,
            src: img.src,
            originalWidth: img.width,
            originalHeight: img.height,
            ...getDefaultImageDimension(
              img.width,
              img.height,
              canvas.width,
              canvas.height,
            ),
          };
          let newOriginalImage = originalImage;
          if (!originalImage) newOriginalImage = data;
          else if (originalImage.id === image?.id) newOriginalImage = image;

          return {
            originalImage: newOriginalImage,
            image: data,
          };
        }),
      alignImage: alignment =>
        set(state => {
          const { canvas, image } = state;
          if (!image) return state;
          const newImage = { ...image };

          switch (alignment) {
            case ImageAlignment.LEFT:
              newImage.x = 0;
              break;
            case ImageAlignment.RIGHT:
              newImage.x = canvas.width - image.width;
              break;
            case ImageAlignment.TOP:
              newImage.y = 0;
              break;
            case ImageAlignment.BOTTOM:
              newImage.y = canvas.height - image.height;
              break;
            case ImageAlignment.HORIZONTAL_CENTER:
              newImage.x = (canvas.width - image.width) / 2;
              break;
            case ImageAlignment.VERTICAL_CENTER:
              newImage.y = (canvas.height - image.height) / 2;
              break;
            default:
              break;
          }

          return { image: newImage };
        }),
    }),
    { name: "zustand" },
  ),
);

export default useStore;
