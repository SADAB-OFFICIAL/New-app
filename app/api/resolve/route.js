import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const type = searchParams.get('type');
  const reqMode = searchParams.get('mode'); // 'batch' or 'episode' (passed from ncloud)

  const headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://m4ulinks.com/'
  };

  try {
    if (type === 'm4u') {
        // ... (Old M4u Logic Same as before)
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const links = [];
        $('a').each((i, el) => {
            const txt = $(el).text().trim();
            const href = $(el).attr('href');
            if(href && (txt.includes('Hub-Cloud') || txt.includes('V-Cloud') || txt.includes('GDFlix'))) {
                links.push({ server: txt, url: href });
            }
        });
        return NextResponse.json({ links });
    } 
    else if (type === 'hub') {
        const apiUrl = `https://nothing-to-see-nine.vercel.app/hubcloud?url=${encodeURIComponent(url)}&key=sadabefy`;
        
        try {
            const apiRes = await axios.get(apiUrl);
            const data = apiRes.data;

            if (data && data.streams && data.streams.length > 0) {
                let validStreams = data.streams.filter(s => s.link && s.link.startsWith('http'));

                // --- 🔥 MAGIC FIX FOR WRONG FILE ---
                // Agar user ne 'batch' maanga hai, to sirf ZIP files dikhao
                if (reqMode === 'batch') {
                    const zipStreams = validStreams.filter(s => s.link.includes('.zip') || s.type === 'zip');
                    if (zipStreams.length > 0) validStreams = zipStreams;
                } 
                // Agar 'episode' maanga hai, to ZIP hata do (taaki galti se pack na download ho)
                else if (reqMode === 'episode') {
                     validStreams = validStreams.filter(s => !s.link.includes('.zip'));
                }

                return NextResponse.json({ 
                    streams: validStreams,
                    title: data.title
                });
            }
            return NextResponse.json({ error: 'No streams found' });

        } catch (apiError) {
            return NextResponse.json({ error: 'API Error' });
        }
    }
    return NextResponse.json({ error: 'Invalid Type' });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Error' });
  }
}
