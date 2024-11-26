"use client";

import { Suspense } from "react";
import { Sidebar } from "@/components/resize";
import { lazy } from "react";
import { Spinner } from "@/components/ui";

const Canvas = lazy(() =>
  import("@/components/resize").then(module => ({ default: module.Canvas })),
);

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-start p-7 gap-20">
      <Suspense
        fallback={
          <div className="w-full flex items-center justify-center gap-2 text-gray-500">
            <Spinner theme="gray" size="large" />
          </div>
        }>
        <Sidebar />
        <div className="w-full h-full flex justify-center items-center overflow-hidden pr-10">
          <div className="w-full h-full flex justify-center items-center relative overflow-hidden max-h-[1100px]">
            <Canvas />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
