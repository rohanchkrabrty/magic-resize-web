"use client";

import { Spinner } from "@/components/ui";
import dynamic from "next/dynamic";
import Sidebar from "@/components/resize/sidebar";

const Canvas = dynamic(() => import("@/components/resize/canvas"), {
  ssr: false,
  loading: () => <Spinner theme="gray" size="large" />,
});

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-start p-7 gap-20">
      <Sidebar />
      <div className="w-full h-full flex justify-center items-center overflow-hidden pr-10">
        <div className="w-full h-full flex justify-center items-center relative overflow-hidden max-h-[1100px]">
          <Canvas />
        </div>
      </div>
    </div>
  );
}
