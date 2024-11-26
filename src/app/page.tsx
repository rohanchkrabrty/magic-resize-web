"use client";

import Image from "next/image";
import { Button, ImageUpload } from "@/components/ui";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import useStore from "@/hooks/useStore";
import { fileToDataURL, loadImage } from "@/lib/util";

const IMAGES = [
  "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/woman-03.webp",
  "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/man-02.webp",
  "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/woman-02.webp",
];

export default function Home() {
  const setImage = useStore(state => state.setImage);
  const router = useRouter();

  const addImageAndRedirect = (src: string) => {
    router.prefetch("/resize");
    console.log({ src });
    loadImage(src).then(data => {
      setImage(data);
      router.push("/resize");
    });
  };

  const handleChange = (file: File) => {
    if (!file) return;
    fileToDataURL(file).then(src => {
      addImageAndRedirect(src);
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="shadow-sm border border-gray-200 p-8 bg-white rounded-2xl w-[500px] gap-10 flex flex-col">
        <Logo />
        <ImageUpload onChange={handleChange} />
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">
            <p>Don&apos;t have a photo?</p>
            <p className="text-gray-500 text-xs font-normal">
              Try one of these
            </p>
          </div>
          <div className="flex gap-4">
            {IMAGES.map((src, index) => (
              <Button
                key={index}
                className="size-12 shadow-md"
                size="icon"
                onClick={() => addImageAndRedirect(src)}>
                <Image
                  alt=""
                  width={100}
                  height={100}
                  src={src}
                  className="size-full rounded-lg object-cover bg-gray-50"
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
