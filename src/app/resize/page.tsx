"use client";

import Sidebar from "@/components/sidebar";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Canvas = dynamic(() => import("@/components/canvas"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-start p-7 gap-20">
      <Sidebar />
      <div className="w-full h-full flex justify-center items-center overflow-hidden pr-10">
        <div className="w-full h-full flex justify-center items-center relative overflow-hidden max-h-[1100px]">
          <Suspense fallback={<div>Loading</div>}>
            <Canvas />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
