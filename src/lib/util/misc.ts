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

export function scale(
  number: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  if (number <= inMin) return outMin;
  if (number >= inMax) return outMax;
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
