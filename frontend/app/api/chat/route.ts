const BACKEND_URL = "http://localhost:3001/api/ask";

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const { prompt } = await req.json();

    const backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!backendRes.ok) {
      throw new Error(`Backend error: HTTP ${backendRes.status}`);
    }

    const data: { response: string } = await backendRes.json();
    return Response.json({ response: data.response });
  } catch (err) {
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}