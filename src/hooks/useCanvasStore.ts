import { create } from "zustand";
import { ImageAlignment } from "@/types/image";

type AlignType = (alignment: ImageAlignment) => void;
type ResetType = () => void;

type CanvasStore = {
  align?: AlignType;
  reset?: ResetType;
  setReset: (reset: ResetType) => void;
  setAlign: (align: AlignType) => void;
};

const useCanvasStore = create<CanvasStore>((set, get) => ({
  setReset: reset => set({ reset }),
  setAlign: align => set({ align }),
}));

export default useCanvasStore;
