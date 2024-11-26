import { Button } from "@/components/ui";
import { useResize } from "@/hooks/queries";
import { useStore } from "@/hooks/store";
import { cropImage, downloadImage, loadImage } from "@/lib/util";

type PropsType = {
  disabled?: boolean;
};

export function MainActions({ disabled = false }: PropsType) {
  const {
    setImage,
    canvas,
    image,
    originalImage,
    setIsResizing,
    resetImageToOriginal,
  } = useStore();
  const resize = useResize();

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

  return (
    <div className="flex flex-col self-stretch gap-4">
      <Button
        disabled={!canRegenerate && cannotResizeImage}
        isLoading={disabled}
        onClick={handleGenerate}>
        {canRegenerate ? "Regenerate" : "Resize"}
      </Button>
      {canRegenerate && (
        <div className="flex w-full gap-2">
          <Button
            variant="secondary"
            disabled={disabled}
            onClick={resetImageToOriginal}
            className="flex-1">
            Reset to default
          </Button>
          <Button
            disabled={disabled}
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
  );
}
