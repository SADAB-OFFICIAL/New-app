import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const type = searchParams.get('type'); // 'm4u' or 'hub'

  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' };

  try {
    const { data } = await axios.get(targetUrl, { headers });
    const $ = cheerio.load(data);
    const results = [];

    if (type === 'm4u') {
      // Logic: Find HubCloud/GDFlix buttons
      $('a').each((i, el) => {
        const txt = $(el).text().trim();
        const href = $(el).attr('href');
        if (txt.includes('Hub-Cloud') || txt.includes('V-Cloud') || txt.includes('GDFlix')) {
          results.push({ server: txt, url: href });
        }
      });
    } 
    else if (type === 'hub') {
      // Logic: Find final download/stream link inside HubCloud
      const directLink = $('a:contains("Download"), a:contains("Watch"), a:contains("Generate")').attr('href');
      if(directLink) return NextResponse.json({ streamUrl: directLink });
      
      // Sometimes it's a redirect
      const metaRefresh = $('meta[http-equiv="refresh"]').attr('content');
      if(metaRefresh) {
         const redirectUrl = metaRefresh.split('url=')[1];
         return NextResponse.json({ streamUrl: redirectUrl });
      }
    }

    return NextResponse.json({ links: results });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
