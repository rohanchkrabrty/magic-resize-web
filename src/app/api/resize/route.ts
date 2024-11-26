import { API_URL } from "@/lib/constants";

export async function POST(request: Request) {
  console.log("loading resize api");
  const requestFormData = await request.formData();

  const res = await fetch(`${API_URL}/magic-resize`, {
    method: "POST",
    body: requestFormData,
  });
  const data = await res.json();

  return Response.json(data);
}
