const DEFAULT = {
  name: 'Aanchal Verma',
  handle: 'aanchal_verrma',
  location: 'Mumbai',
  followers: '70K+',
  avgViews: '50K+',
  posts: '300+',
  totalViews: '14.2M+',
  brandCollabs: '25+',
  returnRate: '9/10',
  replyTime: '48h',
  intro: 'Actor, creator, certified menace on a controller. I make the kind of reels you watch twice and send to your group chat.',
  announcementTitle: 'Booking campaigns for the festive run.',
  announcementBody: 'Creator collaborations, sponsored content and select brand partnerships are open for the next wave.',
  announcementCta: 'Work with me',
  youtubeMain: 'https://www.youtube.com/@Aanchal_verrma',
  youtubeGaming: 'https://www.youtube.com/@Aanchal_verrma',
  featuredVideo: 'https://www.youtube.com/watch?v=xtU8f0g9Zno',
  email: 'workVaanchal@gmail.com',
  brands: ['Veloura', 'Rue Nine', 'Novae Studio', 'Mysa', 'Lune Label', 'Vanta House', 'Aster & Co.', 'Mirae', 'Serein', 'Kairo'],
  services: ['brand collabs', 'sponsored reels', 'campaigns', 'long-term partners'],
  heroImage: '/media/hero',
  announcementImage: '/media/announcement',
  workImage: '/media/work'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ ...DEFAULT, _source: 'defaults', _error: 'D1 binding DB is not configured yet.' });
  const row = await env.DB.prepare('SELECT data FROM site_content WHERE id = 1').first();
  if (!row) return json({ ...DEFAULT, _source: 'defaults' });
  try {
    return json({ ...DEFAULT, ...JSON.parse(row.data), _source: 'd1' });
  } catch {
    return json({ ...DEFAULT, _source: 'defaults', _error: 'Stored content is invalid JSON.' }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  if (!env.DB) return json({ error: 'D1 binding DB is not configured.' }, 503);
  const body = await request.text();
  if (body.length > 200_000) return json({ error: 'Payload too large.' }, 413);
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }
  const clean = { ...DEFAULT, ...data };
  delete clean._source;
  delete clean._error;
  await env.DB.prepare(
    "INSERT INTO site_content (id, data, updated_at) VALUES (1, ?1, datetime('now')) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at"
  ).bind(JSON.stringify(clean)).run();
  return json({ ...clean, _source: 'd1' });
}
