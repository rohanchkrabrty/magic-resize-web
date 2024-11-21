"use client";
import Image from "next/image";
import { Logo } from "@/components/icons";
import { Button, ImageUpload } from "@/components/ui";
import useImageStore from "@/hooks/useImageStore";
import { ImageType } from "@/types/image";
import { useRouter } from "next/navigation";

const IMAGES = [
  {
    id: "1",
    src: "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/woman-03.webp",
  },
  {
    id: "2",
    src: "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/man-02.webp",
  },
  {
    id: "3",
    src: "https://magicstudio-public.s3.amazonaws.com/headshots/assets/poses/512x768/woman-02.webp",
  },
];

export default function Home() {
  const addImage = useImageStore(state => state.addImage);
  const router = useRouter();

  const addImageAndRedirect = (image: ImageType) => {
    addImage(image);
    console.log({ image });
    router.push("/resize");
  };

  const handleChange = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      if (reader.result)
        addImageAndRedirect({
          id: crypto.randomUUID(),
          src: reader.result.toString(),
        });
    };
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
            {IMAGES.map(image => (
              <Button
                key={image.id}
                className="size-12 shadow-md"
                size="icon"
                onClick={() => addImageAndRedirect(image)}>
                <Image
                  alt=""
                  width={100}
                  height={100}
                  src={image.src}
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
