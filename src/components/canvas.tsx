import { useCanvas } from "@/hooks";
import { ImageAlignment } from "@/types/image";
import { cx } from "class-variance-authority";

type Props = {};

export default function Canvas({}: Props) {
  const { parentRef, containerRef, isLoading, align, reset } = useCanvas({});

  return (
    <div
      className="w-full h-full flex justify-center items-center relative"
      ref={parentRef}
      // onClick={() => {
      //   console.log("canvas clikc");
      //   if (!konvaStageRef.current) return;
      //   const layer = konvaStageRef.current.getLayers()[0];
      //   const img = layer.findOne(".image");
      //   const attrs = img?.attrs;
      //   const data = konvaStageRef.current?.toDataURL({
      //     pixelRatio: 1, // or other value you need
      //     x: attrs.x,
      //     y: attrs.y,
      //     width:
      //       attrs.x + attrs.width > sceneWidth
      //         ? sceneWidth - attrs.width - attrs.x
      //         : attrs.width,
      //     height:
      //       attrs.y + attrs.height > sceneHeight
      //         ? sceneHeight - attrs.height - attrs.y
      //         : attrs.height,
      //   });
      //   console.log(data, attrs);
      // }}
    >
      {isLoading && <p className="absolute">Loading</p>}
      <div
        ref={containerRef}
        className={cx(
          "bg-white rounded-md shadow-sm transition-all",
          isLoading ? "invisible scale-90" : "visible scale-100",
        )}
      />
      {/* <select value={crop} onChange={e => setCrop(e.target.value as CROP)}>
        {Object.values(CROP).map(value => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select> */}
    </div>
  );
}
