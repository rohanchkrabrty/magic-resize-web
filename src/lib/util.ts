export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "Anonymous";
    img.src = src;
  });
}
export function fileToDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      if (reader.result) resolve(reader.result.toString());
    };
    reader.onerror = reject;
  });
}
export function downloadImage(src: string) {
  const anchor = document.createElement("a");
  anchor.href = src;
  anchor.target = "_blank";
  // anchor.download = `resized-${Date.now()}.jpg`;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export const getDefaultImageDimension = (
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const ratio = 1;
  const aspectRatio = imageWidth / imageHeight;
  let newWidth = canvasWidth * ratio;
  let newHeight = newWidth / aspectRatio;

  // If height exceeds canvas height, scale down based on height
  if (newHeight > canvasHeight * ratio) {
    newHeight = canvasHeight * ratio;
    newWidth = newHeight * aspectRatio;
  }
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
    x: Math.round((canvasWidth - newWidth) / 2),
    y: Math.round((canvasHeight - newHeight) / 2),
  };
};

export function getImageCrop(
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }

  const x = (image.width - newWidth) / 2;
  const y = (image.height - newHeight) / 2;

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
}

export function cropImage(
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const { cropX, cropY, cropHeight, cropWidth } = getImageCrop(
    image,
    width,
    height,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  context?.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    width,
    height,
  );

  return canvas.toDataURL();
}
