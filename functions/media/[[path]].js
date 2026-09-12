export async function onRequestGet({ env, params }) {
  if (!env.MEDIA) return new Response('R2 binding MEDIA is not configured.', { status: 503 });

  const parts = Array.isArray(params?.path) ? params.path : [];
  const key = parts.join('/').replace(/^\/+/, '');
  if (!['hero', 'announcement', 'work'].includes(key)) {
    return new Response('Not found', { status: 404 });
  }

  const object = await env.MEDIA.get(`site/${key}`);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'no-cache, max-age=0, must-revalidate');
  return new Response(object.body, { headers });
}
