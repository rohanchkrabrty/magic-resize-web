import { create } from "zustand";
import { ImageType } from "@/types/image";

type ImageStore = {
  images: ImageType[];
  currentImage: ImageType | null;
  addImage: (image: ImageType) => void;
};

const useImageStore = create<ImageStore>(set => ({
  images: [],
  currentImage: null,

  // Add a new image to the store
  addImage: image =>
    set(state => ({
      images: [...state.images, image],
      currentImage: image,
    })),
}));

export default useImageStore;
