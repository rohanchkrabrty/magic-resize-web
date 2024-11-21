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
      <div className="w-full h-full flex justify-center items-center p-20">
        <Suspense fallback={<div>Loading</div>}>
          <Canvas />
        </Suspense>
      </div>
    </div>
  );
}
