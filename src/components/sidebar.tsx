import React from "react";
import { Button } from "./ui";
import { Logo } from "./icons";

type Props = {};

export default function Sidebar({}: Props) {
  return (
    <div className="h-full flex-[300px] flex-shrink-0 margin-10 bg-white shadow-sm rounded-3xl flex flex-col px-6 pb-7 pt-6 justify-between">
      <Logo />
      <Button>Resize</Button>
    </div>
  );
}
