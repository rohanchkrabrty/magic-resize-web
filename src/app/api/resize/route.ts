export async function POST(request: Request) {
  const requestFormData = await request.formData();

  const res = await fetch(`https://ai-api.magicstudio.com/api/magic-resize`, {
    method: "POST",
    body: requestFormData,
  });
  const data = await res.json();

  return Response.json(data);
}
