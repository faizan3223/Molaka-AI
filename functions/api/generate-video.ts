export async function onRequestPost(context: any) {
  const { request } = context;
  try {
    const { prompt } = await request.json();
    return new Response(JSON.stringify({
      success: false,
      fallbackMode: 'simulation',
      prompt,
      message: 'Running live real-time 60fps canvas simulation engine.',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
