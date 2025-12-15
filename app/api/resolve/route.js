import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const type = searchParams.get('type'); 

  // Headers for scraping
  const headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://m4ulinks.com/'
  };

  try {
    // ---------------------------------------------------------
    // CASE 1: M4uLinks (Links dhundna)
    // ---------------------------------------------------------
    if (type === 'm4u') {
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
    
    // ---------------------------------------------------------
    // CASE 2: HubCloud / GDFlix -> Custom API Call 🚀
    // ---------------------------------------------------------
    else if (type === 'hub') {
        
        // Aapki API
        const apiUrl = `https://nothing-to-see-nine.vercel.app/hubcloud?url=${encodeURIComponent(url)}&key=sadabefy`;
        console.log("Fetching Servers:", apiUrl);

        try {
            const apiRes = await axios.get(apiUrl);
            const data = apiRes.data;

            // Agar streams mili hain
            if (data && data.streams && data.streams.length > 0) {
                // Hum FILTER nahi karenge, saare valid links bhejenge
                const validStreams = data.streams.filter(s => s.link && s.link.startsWith('http'));
                
                return NextResponse.json({ 
                    streams: validStreams, // Pura array bhej diya
                    title: data.title
                });
            }
            
            return NextResponse.json({ error: 'No streams found' });

        } catch (apiError) {
            console.error("API Error:", apiError.message);
            return NextResponse.json({ error: 'Resolver API Failed' });
        }
    }

    return NextResponse.json({ error: 'Invalid Type' });

  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
