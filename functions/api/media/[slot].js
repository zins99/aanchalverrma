const ALLOWED = new Set(['hero', 'announcement', 'work']);
const MAX_BYTES = 10 * 1024 * 1024;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

export async function onRequestPut({ request, params, env }) {
  if (!env.MEDIA) return json({ error: 'R2 binding MEDIA is not configured.' }, 503);
  const slot = params.slot;
  if (!ALLOWED.has(slot)) return json({ error: 'Unknown media slot.' }, 404);

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) return json({ error: 'Only image uploads are allowed.' }, 415);

  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BYTES) return json({ error: 'Image exceeds the 10 MB limit.' }, 413);

  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_BYTES) return json({ error: 'Image exceeds the 10 MB limit.' }, 413);

  await env.MEDIA.put(`site/${slot}`, body, {
    httpMetadata: {
      contentType,
      cacheControl: 'no-cache'
    }
  });

  return json({ slot, url: `/media/${slot}` });
}
