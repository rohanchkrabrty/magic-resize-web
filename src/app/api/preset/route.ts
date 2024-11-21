export const dynamic = "force-static";

import { API_URL } from "@/lib/constants";

export async function GET() {
  console.log("loading preset api");
  const res = await fetch(`${API_URL}/magic-resize/size-presets`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return Response.json(data);
}
