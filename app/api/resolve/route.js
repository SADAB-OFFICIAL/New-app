import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const type = searchParams.get('type');
  const headers = { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10)' };

  try {
    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    if (type === 'm4u') {
        const links = [];
        $('a').each((i, el) => {
            const txt = $(el).text();
            if(txt.includes('Hub-Cloud') || txt.includes('V-Cloud') || txt.includes('GDFlix')) {
                links.push({ server: txt.trim(), url: $(el).attr('href') });
            }
        });
        return NextResponse.json({ links });
    } else if (type === 'hub') {
        let streamUrl = $('a:contains("Download"), a:contains("Watch")').attr('href');
        const meta = $('meta[http-equiv="refresh"]').attr('content');
        if(!streamUrl && meta) streamUrl = meta.split('url=')[1];
        return NextResponse.json({ streamUrl });
    }
  } catch (e) { return NextResponse.json({ error: 'Failed' }); }
}
