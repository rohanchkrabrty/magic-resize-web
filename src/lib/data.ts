import { Preset } from "@/types/api";

export const DEMO_IMAGES = [
  "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/woman-03.webp",
  "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/man-02.webp",
  "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/woman-02.webp",
];

export const DEFAULT_PRESET: Preset = {
  name: "Square",
  aspect_ratio_label: "1:1",
  aspect_ratio: 1,
  width: 1024,
  height: 1024,
  icon_url: "",
};
