import React from "react";
import { Button } from "./ui";

type Props = {};

export default function Sidebar({}: Props) {
  return (
    <div className="h-full flex-[300px] flex-shrink-0 margin-10 bg-white shadow-sm rounded-3xl flex flex-col px-6 py-7 justify-between">
      Sidebar
      <Button>Resize</Button>
    </div>
  );
}
