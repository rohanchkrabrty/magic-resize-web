import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResize } from "@/hooks/queries";
import { Button, Logo } from "@/components/ui";
import { useStore } from "@/hooks/store";
import { PositionActions } from "./position-actions";
import { PresetActions } from "./preset-actions";
import { cropImage, downloadImage, loadImage } from "@/lib/util";

export default function Sidebar() {
  const {
    setImage,
    canvas,
    originalImage,
    isResizing,
    image,
    setIsResizing,
    resetImageToOriginal,
  } = useStore();

  const resize = useResize();
  const router = useRouter();
  const isImageResizing = resize.loading || isResizing;

  const cannotResizeImage =
    canvas.width === image?.width &&
    canvas.height === image.height &&
    image.x === 0 &&
    image.y === 0;

  const canRegenerate = cannotResizeImage && originalImage?.id !== image.id;

  const handleGenerate = () => {
    setIsResizing(true);
    const imageToUse = canRegenerate ? originalImage : image;
    if (!imageToUse) return;

    const data = cropImage(imageToUse.img, imageToUse.width, imageToUse.height);

    resize
      .execute({
        image: data,
        left: String(Math.round(imageToUse.x)),
        right: String(
          canvas.width - Math.round(imageToUse.x) - imageToUse.width,
        ),
        top: String(Math.round(imageToUse.y)),
        bottom: String(
          canvas.height - Math.round(imageToUse.y) - imageToUse.height,
        ),
      })
      .then(url => {
        if (!url) return;

        loadImage(url).then(data => {
          setImage(data);
          setIsResizing(false);
        });
      });
  };

  useEffect(() => {
    if (!image) return router.push("/");
  }, [image]);

  return (
    <div className="h-full flex-[300px] flex-shrink-0 margin-10 bg-white shadow-sm rounded-3xl flex flex-col px-6 pb-7 pt-6 gap-8 slide-in">
      <Logo />
      <PositionActions disabled={isImageResizing} />
      <PresetActions disabled={isImageResizing} />
      <div className="border-b border-gray-200" />
      <div className="flex flex-col self-stretch gap-4">
        <Button
          disabled={!canRegenerate && cannotResizeImage}
          isLoading={isImageResizing}
          onClick={handleGenerate}>
          {canRegenerate ? "Regenerate" : "Resize"}
        </Button>
        {canRegenerate && (
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              disabled={isImageResizing}
              onClick={resetImageToOriginal}
              className="flex-1">
              Reset to default
            </Button>
            <Button
              disabled={isImageResizing}
              className="flex-1"
              variant="secondary"
              onClick={() => {
                console.log("image -> ", image.src);
                downloadImage(image.src);
              }}>
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
