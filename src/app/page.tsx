"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, ImageUpload, Logo } from "@/components/ui";
import { fileToDataURL, loadImage } from "@/lib/util";
import { DEMO_IMAGES } from "@/lib/data";
import { useStore } from "@/hooks/store";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const setImage = useStore(state => state.setImage);
  const router = useRouter();

  const addImageAndRedirect = (src: string) => {
    setIsLoading(true);
    router.prefetch("/resize");
    console.log({ src });
    loadImage(src).then(data => {
      setImage(data, true);
      router.push("/resize");
    });
  };

  const handleChange = (file: File) => {
    if (!file) return;
    setIsLoading(true);
    fileToDataURL(file).then(src => {
      addImageAndRedirect(src);
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="shadow-sm border border-gray-200 p-8 bg-white rounded-2xl w-[500px] gap-10 flex flex-col">
        <Logo />
        <ImageUpload onChange={handleChange} isLoading={isLoading} />
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">
            <p>Don&apos;t have a photo?</p>
            <p className="text-gray-500 text-xs font-normal">
              Try one of these
            </p>
          </div>
          <div className="flex gap-4">
            {DEMO_IMAGES.map((src, index) => (
              <Button
                key={index}
                className="size-12 shadow-md"
                size="icon"
                disabled={isLoading}
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
