import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResize } from "@/hooks/queries";
import { Logo } from "@/components/ui";
import { useStore } from "@/hooks/store";
import { PositionActions } from "./position-actions";
import { PresetActions } from "./preset-actions";
import { MainActions } from "./main-actions";

export function Sidebar() {
  const image = useStore(state => state.image);
  const isResizing = useStore(state => state.isResizing);

  const resize = useResize();
  const router = useRouter();
  const isImageResizing = resize.loading || isResizing;

  useEffect(() => {
    if (!image) return router.push("/");
  }, [image]);

  return (
    <div className="h-full flex-[300px] flex-shrink-0 margin-10 bg-white shadow-sm rounded-3xl flex flex-col px-6 pb-7 pt-6 gap-8">
      <Logo />
      <PositionActions disabled={isImageResizing} />
      <PresetActions disabled={isImageResizing} />
      <div className="border-b border-gray-200" />
      <MainActions disabled={isImageResizing} />
    </div>
  );
}
